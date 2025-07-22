import os
import hashlib
import tempfile
from typing import Dict, Any, Optional, BinaryIO
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
import subprocess
import mimetypes

# Optional integrations
try:
    import clamd
    CLAMD_AVAILABLE = True
except ImportError:
    CLAMD_AVAILABLE = False

try:
    import requests
    VIRUSTOTAL_AVAILABLE = True
except ImportError:
    VIRUSTOTAL_AVAILABLE = False

from app.core.config import settings


@dataclass
class ScanResult:
    """Result of virus scanning operation."""
    is_clean: bool
    scan_engine: str
    threats_found: list[str]
    scan_time: float
    file_hash: str
    scan_timestamp: datetime
    confidence: float  # 0-1 confidence in the result
    details: Optional[Dict[str, Any]] = None


class VirusScannerInterface:
    """Abstract interface for virus scanning."""
    
    async def scan_file(self, file_path: str) -> ScanResult:
        """Scan a file for viruses."""
        raise NotImplementedError
    
    async def scan_file_data(self, file_data: BinaryIO, filename: str) -> ScanResult:
        """Scan file data for viruses."""
        raise NotImplementedError


class ClamAVScanner(VirusScannerInterface):
    """ClamAV antivirus scanner implementation."""
    
    def __init__(self):
        if not CLAMD_AVAILABLE:
            raise ImportError("pyclamd is required for ClamAV scanning. Install with: pip install pyclamd")
        
        self.clamd_host = getattr(settings, 'CLAMAV_HOST', 'localhost')
        self.clamd_port = getattr(settings, 'CLAMAV_PORT', 3310)
        
        try:
            self.clamd_client = clamd.ClamdUnixSocket() if self.clamd_host == 'unix' else clamd.ClamdNetworkSocket(self.clamd_host, self.clamd_port)
            # Test connection
            self.clamd_client.ping()
        except Exception as e:
            raise ConnectionError(f"Failed to connect to ClamAV daemon: {str(e)}")
    
    async def scan_file(self, file_path: str) -> ScanResult:
        """Scan file using ClamAV."""
        start_time = datetime.utcnow()
        
        try:
            # Calculate file hash
            file_hash = self._calculate_file_hash(file_path)
            
            # Scan file
            scan_result = self.clamd_client.scan(file_path)
            scan_time = (datetime.utcnow() - start_time).total_seconds()
            
            if scan_result is None:
                # Clean file
                return ScanResult(
                    is_clean=True,
                    scan_engine="ClamAV",
                    threats_found=[],
                    scan_time=scan_time,
                    file_hash=file_hash,
                    scan_timestamp=start_time,
                    confidence=0.95
                )
            else:
                # Threats found
                threats = list(scan_result.values()) if isinstance(scan_result, dict) else [str(scan_result)]
                return ScanResult(
                    is_clean=False,
                    scan_engine="ClamAV",
                    threats_found=threats,
                    scan_time=scan_time,
                    file_hash=file_hash,
                    scan_timestamp=start_time,
                    confidence=0.95,
                    details={"raw_result": scan_result}
                )
                
        except Exception as e:
            return ScanResult(
                is_clean=False,
                scan_engine="ClamAV",
                threats_found=[f"Scan error: {str(e)}"],
                scan_time=(datetime.utcnow() - start_time).total_seconds(),
                file_hash=self._calculate_file_hash(file_path) if os.path.exists(file_path) else "",
                scan_timestamp=start_time,
                confidence=0.0,
                details={"error": str(e)}
            )
    
    async def scan_file_data(self, file_data: BinaryIO, filename: str) -> ScanResult:
        """Scan file data using ClamAV."""
        # Write to temporary file and scan
        with tempfile.NamedTemporaryFile(delete=False, suffix=Path(filename).suffix) as temp_file:
            temp_file.write(file_data.read())
            temp_file_path = temp_file.name
        
        try:
            result = await self.scan_file(temp_file_path)
            return result
        finally:
            # Clean up temporary file
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
    
    def _calculate_file_hash(self, file_path: str) -> str:
        """Calculate SHA256 hash of file."""
        sha256_hash = hashlib.sha256()
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                sha256_hash.update(chunk)
        return sha256_hash.hexdigest()


class VirusTotalScanner(VirusScannerInterface):
    """VirusTotal API scanner implementation."""
    
    def __init__(self):
        if not VIRUSTOTAL_AVAILABLE:
            raise ImportError("requests is required for VirusTotal scanning. Install with: pip install requests")
        
        self.api_key = getattr(settings, 'VIRUSTOTAL_API_KEY', None)
        if not self.api_key:
            raise ValueError("VirusTotal API key not configured. Set VIRUSTOTAL_API_KEY in settings.")
        
        self.api_url = "https://www.virustotal.com/vtapi/v2"
    
    async def scan_file(self, file_path: str) -> ScanResult:
        """Scan file using VirusTotal API."""
        start_time = datetime.utcnow()
        file_hash = self._calculate_file_hash(file_path)
        
        try:
            # First, check if we already have results for this hash
            report = await self._get_file_report(file_hash)
            
            if report and report.get('response_code') == 1:
                # We have existing results
                scan_time = (datetime.utcnow() - start_time).total_seconds()
                return self._parse_virustotal_result(report, file_hash, scan_time, start_time)
            
            # Upload file for scanning
            upload_result = await self._upload_file(file_path)
            
            if upload_result.get('response_code') == 1:
                # File uploaded successfully, get scan ID
                scan_id = upload_result.get('scan_id')
                
                # Wait a bit and get report
                import asyncio
                await asyncio.sleep(15)  # Wait for scan to complete
                
                report = await self._get_file_report(file_hash)
                scan_time = (datetime.utcnow() - start_time).total_seconds()
                
                if report and report.get('response_code') == 1:
                    return self._parse_virustotal_result(report, file_hash, scan_time, start_time)
                else:
                    # Scan still pending
                    return ScanResult(
                        is_clean=True,  # Default to clean if scan is pending
                        scan_engine="VirusTotal",
                        threats_found=[],
                        scan_time=scan_time,
                        file_hash=file_hash,
                        scan_timestamp=start_time,
                        confidence=0.5,  # Lower confidence for pending scans
                        details={"status": "scan_pending", "scan_id": scan_id}
                    )
            else:
                raise Exception(f"Failed to upload file to VirusTotal: {upload_result}")
                
        except Exception as e:
            return ScanResult(
                is_clean=False,
                scan_engine="VirusTotal",
                threats_found=[f"Scan error: {str(e)}"],
                scan_time=(datetime.utcnow() - start_time).total_seconds(),
                file_hash=file_hash,
                scan_timestamp=start_time,
                confidence=0.0,
                details={"error": str(e)}
            )
    
    async def scan_file_data(self, file_data: BinaryIO, filename: str) -> ScanResult:
        """Scan file data using VirusTotal."""
        # Write to temporary file and scan
        with tempfile.NamedTemporaryFile(delete=False, suffix=Path(filename).suffix) as temp_file:
            temp_file.write(file_data.read())
            temp_file_path = temp_file.name
        
        try:
            result = await self.scan_file(temp_file_path)
            return result
        finally:
            # Clean up temporary file
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
    
    async def _get_file_report(self, file_hash: str) -> Optional[Dict[str, Any]]:
        """Get file report from VirusTotal."""
        params = {
            'apikey': self.api_key,
            'resource': file_hash
        }
        
        response = requests.get(f"{self.api_url}/file/report", params=params)
        if response.status_code == 200:
            return response.json()
        return None
    
    async def _upload_file(self, file_path: str) -> Dict[str, Any]:
        """Upload file to VirusTotal for scanning."""
        params = {'apikey': self.api_key}
        
        with open(file_path, 'rb') as f:
            files = {'file': f}
            response = requests.post(f"{self.api_url}/file/scan", files=files, params=params)
        
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"VirusTotal upload failed with status {response.status_code}")
    
    def _parse_virustotal_result(self, report: Dict[str, Any], file_hash: str, scan_time: float, start_time: datetime) -> ScanResult:
        """Parse VirusTotal scan result."""
        positives = report.get('positives', 0)
        total = report.get('total', 0)
        
        threats = []
        if positives > 0:
            scans = report.get('scans', {})
            threats = [
                f"{engine}: {result.get('result', 'Unknown')}"
                for engine, result in scans.items()
                if result.get('detected', False)
            ]
        
        # Calculate confidence based on number of engines
        confidence = min(0.9, total / 50) if total > 0 else 0.5
        
        return ScanResult(
            is_clean=positives == 0,
            scan_engine="VirusTotal",
            threats_found=threats,
            scan_time=scan_time,
            file_hash=file_hash,
            scan_timestamp=start_time,
            confidence=confidence,
            details={
                "positives": positives,
                "total": total,
                "scan_engines": list(report.get('scans', {}).keys())
            }
        )
    
    def _calculate_file_hash(self, file_path: str) -> str:
        """Calculate SHA256 hash of file."""
        sha256_hash = hashlib.sha256()
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                sha256_hash.update(chunk)
        return sha256_hash.hexdigest()


class BasicFileScanner(VirusScannerInterface):
    """Basic file scanner with heuristic checks (fallback)."""
    
    def __init__(self):
        self.dangerous_extensions = {
            '.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js',
            '.jar', '.app', '.deb', '.pkg', '.dmg', '.iso'
        }
        
        # Known malicious file signatures (simplified)
        self.malicious_signatures = [
            b'X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*',  # EICAR test
        ]
    
    async def scan_file(self, file_path: str) -> ScanResult:
        """Basic heuristic file scanning."""
        start_time = datetime.utcnow()
        file_hash = self._calculate_file_hash(file_path)
        threats = []
        
        try:
            # Check file extension
            file_ext = Path(file_path).suffix.lower()
            if file_ext in self.dangerous_extensions:
                threats.append(f"Potentially dangerous file type: {file_ext}")
            
            # Check file size (unusually large files)
            file_size = os.path.getsize(file_path)
            if file_size > 50 * 1024 * 1024:  # 50MB
                threats.append("Unusually large file size")
            
            # Check for known malicious signatures
            with open(file_path, 'rb') as f:
                content = f.read(1024)  # Read first 1KB
                for signature in self.malicious_signatures:
                    if signature in content:
                        threats.append("Known test virus signature detected")
            
            # Check MIME type consistency
            guessed_type, _ = mimetypes.guess_type(file_path)
            if guessed_type and 'executable' in guessed_type:
                threats.append("Executable file detected")
            
            scan_time = (datetime.utcnow() - start_time).total_seconds()
            
            return ScanResult(
                is_clean=len(threats) == 0,
                scan_engine="BasicScanner",
                threats_found=threats,
                scan_time=scan_time,
                file_hash=file_hash,
                scan_timestamp=start_time,
                confidence=0.6,  # Lower confidence for basic scanning
                details={"file_size": file_size, "file_extension": file_ext}
            )
            
        except Exception as e:
            return ScanResult(
                is_clean=False,
                scan_engine="BasicScanner",
                threats_found=[f"Scan error: {str(e)}"],
                scan_time=(datetime.utcnow() - start_time).total_seconds(),
                file_hash=file_hash,
                scan_timestamp=start_time,
                confidence=0.0,
                details={"error": str(e)}
            )
    
    async def scan_file_data(self, file_data: BinaryIO, filename: str) -> ScanResult:
        """Scan file data using basic heuristics."""
        # Write to temporary file and scan
        with tempfile.NamedTemporaryFile(delete=False, suffix=Path(filename).suffix) as temp_file:
            temp_file.write(file_data.read())
            temp_file_path = temp_file.name
        
        try:
            result = await self.scan_file(temp_file_path)
            return result
        finally:
            # Clean up temporary file
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
    
    def _calculate_file_hash(self, file_path: str) -> str:
        """Calculate SHA256 hash of file."""
        sha256_hash = hashlib.sha256()
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                sha256_hash.update(chunk)
        return sha256_hash.hexdigest()


class VirusScanManager:
    """Manager for virus scanning with multiple engine support."""
    
    def __init__(self):
        self.scanners = []
        self._initialize_scanners()
    
    def _initialize_scanners(self):
        """Initialize available virus scanners."""
        scanner_types = getattr(settings, 'VIRUS_SCANNERS', ['basic']).copy()
        
        for scanner_type in scanner_types:
            try:
                if scanner_type.lower() == 'clamav' and CLAMD_AVAILABLE:
                    self.scanners.append(ClamAVScanner())
                elif scanner_type.lower() == 'virustotal' and VIRUSTOTAL_AVAILABLE:
                    self.scanners.append(VirusTotalScanner())
                elif scanner_type.lower() == 'basic':
                    self.scanners.append(BasicFileScanner())
            except Exception as e:
                print(f"Failed to initialize {scanner_type} scanner: {e}")
        
        # Always have at least basic scanner as fallback
        if not self.scanners:
            self.scanners.append(BasicFileScanner())
    
    async def scan_file(self, file_path: str) -> Dict[str, Any]:
        """Scan file with all available scanners."""
        results = []
        overall_clean = True
        all_threats = []
        
        for scanner in self.scanners:
            try:
                result = await scanner.scan_file(file_path)
                results.append(result.__dict__)
                
                if not result.is_clean:
                    overall_clean = False
                    all_threats.extend(result.threats_found)
                    
            except Exception as e:
                results.append({
                    "is_clean": False,
                    "scan_engine": type(scanner).__name__,
                    "threats_found": [f"Scanner error: {str(e)}"],
                    "scan_time": 0,
                    "file_hash": "",
                    "scan_timestamp": datetime.utcnow(),
                    "confidence": 0.0,
                    "details": {"error": str(e)}
                })
                overall_clean = False
        
        # Calculate overall confidence
        confidences = [r.get('confidence', 0) for r in results if r.get('confidence', 0) > 0]
        overall_confidence = sum(confidences) / len(confidences) if confidences else 0
        
        return {
            "is_clean": overall_clean,
            "threats_found": list(set(all_threats)),
            "scan_results": results,
            "overall_confidence": overall_confidence,
            "scanners_used": [r.get('scan_engine') for r in results],
            "scan_summary": {
                "total_scanners": len(results),
                "clean_results": sum(1 for r in results if r.get('is_clean', False)),
                "threat_results": sum(1 for r in results if not r.get('is_clean', True))
            }
        }
    
    async def scan_file_data(self, file_data: BinaryIO, filename: str) -> Dict[str, Any]:
        """Scan file data with all available scanners."""
        # Write to temporary file and scan
        with tempfile.NamedTemporaryFile(delete=False, suffix=Path(filename).suffix) as temp_file:
            file_data.seek(0)  # Reset file pointer
            temp_file.write(file_data.read())
            temp_file_path = temp_file.name
        
        try:
            result = await self.scan_file(temp_file_path)
            return result
        finally:
            # Clean up temporary file
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
    
    def get_scanner_status(self) -> Dict[str, Any]:
        """Get status of all configured scanners."""
        return {
            "available_scanners": [type(scanner).__name__ for scanner in self.scanners],
            "total_scanners": len(self.scanners),
            "clamav_available": CLAMD_AVAILABLE,
            "virustotal_available": VIRUSTOTAL_AVAILABLE and hasattr(settings, 'VIRUSTOTAL_API_KEY'),
            "basic_scanner_enabled": any(isinstance(s, BasicFileScanner) for s in self.scanners)
        } 