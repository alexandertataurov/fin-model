#!/usr/bin/env python3
"""
Comprehensive Test Runner for FinVision Project

This script runs all types of tests across the entire project:
- Backend unit tests
- Backend integration tests  
- Frontend unit tests
- Frontend integration tests
- End-to-end tests
- Performance tests
- Security tests
- Accessibility tests

Usage:
    python run_tests.py                    # Run all tests
    python run_tests.py --unit             # Run only unit tests
    python run_tests.py --integration      # Run only integration tests
    python run_tests.py --e2e              # Run only E2E tests
    python run_tests.py --performance      # Run only performance tests
    python run_tests.py --quick            # Run quick test suite
    python run_tests.py --coverage         # Run with coverage reports
    python run_tests.py --parallel         # Run tests in parallel where possible
"""

import argparse
import os
import sys
import subprocess
import time
import json
from pathlib import Path
from typing import List, Dict, Any
from dataclasses import dataclass
from concurrent.futures import ThreadPoolExecutor, as_completed


@dataclass
class TestResult:
    name: str
    success: bool
    duration: float
    output: str
    coverage: Dict[str, Any] = None


class TestRunner:
    def __init__(self, project_root: Path = None):
        self.project_root = project_root or Path(__file__).parent
        self.backend_dir = self.project_root / "backend"
        self.frontend_dir = self.project_root / "frontend"
        self.results: List[TestResult] = []
        
    def run_command(self, command: List[str], cwd: Path = None, env: Dict[str, str] = None) -> TestResult:
        """Run a command and return the result."""
        name = " ".join(command)
        print(f"🏃 Running: {name}")
        
        start_time = time.time()
        
        try:
            result = subprocess.run(
                command,
                cwd=cwd or self.project_root,
                capture_output=True,
                text=True,
                env={**os.environ, **(env or {})}
            )
            
            duration = time.time() - start_time
            success = result.returncode == 0
            
            if success:
                print(f"✅ {name} - {duration:.2f}s")
            else:
                print(f"❌ {name} - {duration:.2f}s")
                print(f"Error output: {result.stderr}")
            
            return TestResult(
                name=name,
                success=success,
                duration=duration,
                output=result.stdout + result.stderr
            )
            
        except Exception as e:
            duration = time.time() - start_time
            print(f"💥 {name} - Failed to run: {e}")
            
            return TestResult(
                name=name,
                success=False,
                duration=duration,
                output=str(e)
            )
    
    def run_backend_unit_tests(self, coverage: bool = False) -> TestResult:
        """Run backend unit tests."""
        command = ["pytest", "tests/", "-v", "-m", "unit"]
        
        if coverage:
            command.extend(["--cov=app", "--cov-report=html", "--cov-report=xml"])
        
        return self.run_command(command, cwd=self.backend_dir)
    
    def run_backend_integration_tests(self) -> TestResult:
        """Run backend integration tests."""
        command = ["pytest", "tests/", "-v", "-m", "integration"]
        return self.run_command(command, cwd=self.backend_dir)
    
    def run_backend_api_tests(self) -> TestResult:
        """Run backend API tests."""
        command = ["pytest", "tests/test_api_endpoints.py", "-v"]
        return self.run_command(command, cwd=self.backend_dir)
    
    def run_backend_service_tests(self) -> TestResult:
        """Run backend service tests."""
        command = ["pytest", "tests/test_services_unit.py", "-v"]
        return self.run_command(command, cwd=self.backend_dir)
    
    def run_frontend_unit_tests(self, coverage: bool = False) -> TestResult:
        """Run frontend unit tests."""
        if coverage:
            command = ["npm", "run", "test:coverage"]
        else:
            command = ["npm", "run", "test:unit"]
        
        return self.run_command(command, cwd=self.frontend_dir)
    
    def run_frontend_integration_tests(self) -> TestResult:
        """Run frontend integration tests."""
        command = ["npm", "run", "test:integration"]
        return self.run_command(command, cwd=self.frontend_dir)
    
    def run_frontend_performance_tests(self) -> TestResult:
        """Run frontend performance tests."""
        command = ["npm", "run", "test:performance"]
        return self.run_command(command, cwd=self.frontend_dir)
    
    def run_e2e_tests(self, browser: str = "chrome", headed: bool = False) -> TestResult:
        """Run end-to-end tests."""
        command = ["npx", "cypress", "run", "--browser", browser]
        
        if headed:
            command.append("--headed")
        
        return self.run_command(command, cwd=self.frontend_dir)
    
    def run_accessibility_tests(self) -> TestResult:
        """Run accessibility tests."""
        command = ["npm", "run", "test:a11y"]
        return self.run_command(command, cwd=self.frontend_dir)
    
    def run_performance_load_tests(self) -> TestResult:
        """Run performance/load tests with k6."""
        if not self.check_k6_installed():
            return TestResult(
                name="k6 load tests",
                success=False,
                duration=0,
                output="k6 not installed. Please install k6 to run performance tests."
            )
        
        command = ["k6", "run", "tests/performance/load_test.js"]
        return self.run_command(command, cwd=self.backend_dir)
    
    def run_security_tests(self) -> TestResult:
        """Run security tests."""
        command = ["pytest", "tests/", "-v", "-m", "security"]
        return self.run_command(command, cwd=self.backend_dir)
    
    def run_linting(self) -> List[TestResult]:
        """Run linting checks."""
        results = []
        
        # Backend linting
        backend_lint = self.run_command(
            ["flake8", "app/", "tests/", "--max-line-length=127"],
            cwd=self.backend_dir
        )
        results.append(backend_lint)
        
        # Frontend linting
        frontend_lint = self.run_command(
            ["npm", "run", "lint:ci"],
            cwd=self.frontend_dir
        )
        results.append(frontend_lint)
        
        return results
    
    def run_type_checking(self) -> List[TestResult]:
        """Run type checking."""
        results = []
        
        # Backend type checking (mypy if configured)
        # mypy_result = self.run_command(
        #     ["mypy", "app/"],
        #     cwd=self.backend_dir
        # )
        # results.append(mypy_result)
        
        # Frontend type checking
        typescript_result = self.run_command(
            ["npm", "run", "type-check"],
            cwd=self.frontend_dir
        )
        results.append(typescript_result)
        
        return results
    
    def check_k6_installed(self) -> bool:
        """Check if k6 is installed."""
        try:
            subprocess.run(["k6", "version"], capture_output=True, check=True)
            return True
        except (subprocess.CalledProcessError, FileNotFoundError):
            return False
    
    def setup_test_environment(self):
        """Set up the test environment."""
        print("🔧 Setting up test environment...")
        
        # Install backend dependencies
        backend_setup = self.run_command(
            ["pip", "install", "-r", "requirements.txt"],
            cwd=self.backend_dir
        )
        
        if not backend_setup.success:
            print("❌ Failed to install backend dependencies")
            return False
        
        # Install frontend dependencies
        frontend_setup = self.run_command(
            ["npm", "install"],
            cwd=self.frontend_dir
        )
        
        if not frontend_setup.success:
            print("❌ Failed to install frontend dependencies")
            return False
        
        print("✅ Test environment setup complete")
        return True
    
    def run_all_tests(self, 
                     coverage: bool = False, 
                     parallel: bool = False,
                     include_performance: bool = True,
                     include_e2e: bool = True) -> List[TestResult]:
        """Run all tests."""
        print("🚀 Running comprehensive test suite...")
        
        all_results = []
        
        # Code quality checks (always run first)
        print("\n📝 Running code quality checks...")
        all_results.extend(self.run_linting())
        all_results.extend(self.run_type_checking())
        
        if parallel:
            # Run tests in parallel where possible
            with ThreadPoolExecutor(max_workers=4) as executor:
                futures = []
                
                # Submit unit tests
                futures.append(executor.submit(self.run_backend_unit_tests, coverage))
                futures.append(executor.submit(self.run_frontend_unit_tests, coverage))
                
                # Submit integration tests
                futures.append(executor.submit(self.run_backend_integration_tests))
                futures.append(executor.submit(self.run_frontend_integration_tests))
                
                # Submit other tests
                if include_performance:
                    futures.append(executor.submit(self.run_frontend_performance_tests))
                    futures.append(executor.submit(self.run_performance_load_tests))
                
                futures.append(executor.submit(self.run_accessibility_tests))
                futures.append(executor.submit(self.run_security_tests))
                
                # Collect results
                for future in as_completed(futures):
                    result = future.result()
                    all_results.append(result)
        else:
            # Run tests sequentially
            print("\n🧪 Running unit tests...")
            all_results.append(self.run_backend_unit_tests(coverage))
            all_results.append(self.run_frontend_unit_tests(coverage))
            
            print("\n🔗 Running integration tests...")
            all_results.append(self.run_backend_integration_tests())
            all_results.append(self.run_frontend_integration_tests())
            all_results.append(self.run_backend_api_tests())
            all_results.append(self.run_backend_service_tests())
            
            if include_performance:
                print("\n⚡ Running performance tests...")
                all_results.append(self.run_frontend_performance_tests())
                all_results.append(self.run_performance_load_tests())
            
            print("\n♿ Running accessibility tests...")
            all_results.append(self.run_accessibility_tests())
            
            print("\n🔒 Running security tests...")
            all_results.append(self.run_security_tests())
        
        # E2E tests (always run last, sequentially)
        if include_e2e:
            print("\n🎭 Running end-to-end tests...")
            all_results.append(self.run_e2e_tests())
        
        return all_results
    
    def run_quick_tests(self) -> List[TestResult]:
        """Run a quick subset of tests for fast feedback."""
        print("⚡ Running quick test suite...")
        
        results = []
        
        # Quick linting
        results.extend(self.run_linting())
        
        # Unit tests only
        results.append(self.run_backend_unit_tests())
        results.append(self.run_frontend_unit_tests())
        
        return results
    
    def generate_report(self, results: List[TestResult]):
        """Generate a comprehensive test report."""
        total_tests = len(results)
        passed_tests = sum(1 for r in results if r.success)
        failed_tests = total_tests - passed_tests
        total_duration = sum(r.duration for r in results)
        
        print("\n" + "="*80)
        print("📊 TEST REPORT")
        print("="*80)
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests} ✅")
        print(f"Failed: {failed_tests} ❌")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        print(f"Total Duration: {total_duration:.2f}s")
        print()
        
        # Detailed results
        for result in results:
            status = "✅" if result.success else "❌"
            print(f"{status} {result.name} ({result.duration:.2f}s)")
        
        # Failed tests details
        if failed_tests > 0:
            print("\n" + "="*80)
            print("❌ FAILED TESTS DETAILS")
            print("="*80)
            
            for result in results:
                if not result.success:
                    print(f"\n{result.name}:")
                    print("-" * 40)
                    print(result.output[-500:])  # Last 500 chars
        
        # Save JSON report
        report_data = {
            "summary": {
                "total": total_tests,
                "passed": passed_tests,
                "failed": failed_tests,
                "success_rate": (passed_tests/total_tests)*100,
                "duration": total_duration
            },
            "results": [
                {
                    "name": r.name,
                    "success": r.success,
                    "duration": r.duration
                }
                for r in results
            ]
        }
        
        with open("test-report.json", "w") as f:
            json.dump(report_data, f, indent=2)
        
        print(f"\n📄 Detailed report saved to: test-report.json")
        
        return passed_tests == total_tests


def main():
    parser = argparse.ArgumentParser(description="Run FinVision test suite")
    parser.add_argument("--unit", action="store_true", help="Run only unit tests")
    parser.add_argument("--integration", action="store_true", help="Run only integration tests")
    parser.add_argument("--e2e", action="store_true", help="Run only E2E tests")
    parser.add_argument("--performance", action="store_true", help="Run only performance tests")
    parser.add_argument("--quick", action="store_true", help="Run quick test suite")
    parser.add_argument("--coverage", action="store_true", help="Run with coverage reports")
    parser.add_argument("--parallel", action="store_true", help="Run tests in parallel")
    parser.add_argument("--setup", action="store_true", help="Set up test environment only")
    parser.add_argument("--no-e2e", action="store_true", help="Skip E2E tests")
    parser.add_argument("--no-performance", action="store_true", help="Skip performance tests")
    
    args = parser.parse_args()
    
    runner = TestRunner()
    
    # Setup environment if requested
    if args.setup:
        success = runner.setup_test_environment()
        sys.exit(0 if success else 1)
    
    # Determine which tests to run
    results = []
    
    if args.quick:
        results = runner.run_quick_tests()
    elif args.unit:
        print("🧪 Running unit tests...")
        results.append(runner.run_backend_unit_tests(args.coverage))
        results.append(runner.run_frontend_unit_tests(args.coverage))
    elif args.integration:
        print("🔗 Running integration tests...")
        results.append(runner.run_backend_integration_tests())
        results.append(runner.run_frontend_integration_tests())
        results.append(runner.run_backend_api_tests())
    elif args.e2e:
        print("🎭 Running E2E tests...")
        results.append(runner.run_e2e_tests())
    elif args.performance:
        print("⚡ Running performance tests...")
        results.append(runner.run_frontend_performance_tests())
        results.append(runner.run_performance_load_tests())
    else:
        # Run all tests
        results = runner.run_all_tests(
            coverage=args.coverage,
            parallel=args.parallel,
            include_performance=not args.no_performance,
            include_e2e=not args.no_e2e
        )
    
    # Generate report
    all_passed = runner.generate_report(results)
    
    # Exit with appropriate code
    sys.exit(0 if all_passed else 1)


if __name__ == "__main__":
    main() 