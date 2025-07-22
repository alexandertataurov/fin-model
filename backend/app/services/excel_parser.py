import json
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple, Union
from datetime import datetime
import pandas as pd
import openpyxl
from openpyxl import load_workbook
from openpyxl.utils import get_column_letter
from openpyxl.cell import Cell

from app.schemas.file import (
    ExcelSheetInfo, FileValidationResult, ParsedFileData, 
    TemplateValidationConfig
)


class ExcelParser:
    """Service for parsing Excel files and extracting financial data."""
    
    def __init__(self):
        self.supported_extensions = ['.xlsx', '.xls']
        self.financial_templates = {
            'pnl': self._get_pnl_template(),
            'balance_sheet': self._get_balance_sheet_template(),
            'cash_flow': self._get_cash_flow_template()
        }
    
    def parse_excel_file(self, file_path: str) -> ParsedFileData:
        """
        Parse an Excel file and extract structured data.
        
        Args:
            file_path: Path to the Excel file
            
        Returns:
            ParsedFileData with extracted information
        """
        try:
            # Load workbook
            workbook = load_workbook(file_path, data_only=False)
            
            # Extract basic sheet information
            sheets_info = []
            for sheet_name in workbook.sheetnames:
                sheet = workbook[sheet_name]
                sheet_info = self._analyze_sheet(sheet, sheet_name)
                sheets_info.append(sheet_info)
            
            # Validate and identify financial statement types
            validation_result = self._validate_financial_statements(sheets_info, workbook)
            
            # Extract financial data if valid
            financial_statements = None
            key_metrics = None
            assumptions = None
            
            if validation_result.is_valid:
                financial_statements = self._extract_financial_statements(workbook, validation_result)
                key_metrics = self._extract_key_metrics(workbook, financial_statements)
                assumptions = self._extract_assumptions(workbook)
            
            return ParsedFileData(
                file_id=0,  # Will be set by the service
                sheets=sheets_info,
                financial_statements=financial_statements,
                key_metrics=key_metrics,
                assumptions=assumptions,
                validation_summary=validation_result
            )
            
        except Exception as e:
            return ParsedFileData(
                file_id=0,
                sheets=[],
                validation_summary=FileValidationResult(
                    is_valid=False,
                    errors=[f"Failed to parse Excel file: {str(e)}"]
                )
            )
    
    def _analyze_sheet(self, sheet, sheet_name: str) -> ExcelSheetInfo:
        """Analyze a single worksheet and extract metadata."""
        # Get actual used range
        min_row, max_row = sheet.min_row, sheet.max_row
        min_col, max_col = sheet.min_column, sheet.max_column
        
        # Extract column headers (assumed to be in first row)
        columns = []
        if max_row > 0:
            for col in range(min_col, max_col + 1):
                cell_value = sheet.cell(row=min_row, column=col).value
                if cell_value:
                    columns.append(str(cell_value).strip())
                else:
                    columns.append(f"Column_{get_column_letter(col)}")
        
        # Detect if first row contains headers
        has_headers = self._detect_headers(sheet, min_row, min_col, max_col)
        
        # Calculate actual data range
        data_range = f"{get_column_letter(min_col)}{min_row}:{get_column_letter(max_col)}{max_row}"
        
        return ExcelSheetInfo(
            name=sheet_name,
            row_count=max_row - min_row + 1 if max_row > 0 else 0,
            column_count=max_col - min_col + 1 if max_col > 0 else 0,
            columns=columns,
            has_headers=has_headers,
            data_range=data_range
        )
    
    def _detect_headers(self, sheet, min_row: int, min_col: int, max_col: int) -> bool:
        """Detect if the first row contains headers."""
        if min_row >= sheet.max_row:
            return False
        
        header_indicators = 0
        total_cells = 0
        
        for col in range(min_col, min_col + min(max_col - min_col + 1, 10)):  # Check first 10 columns
            cell_value = sheet.cell(row=min_row, column=col).value
            if cell_value:
                total_cells += 1
                value_str = str(cell_value).lower()
                
                # Check for common header patterns
                if any(keyword in value_str for keyword in [
                    'account', 'description', 'amount', 'value', 'date', 'period',
                    'revenue', 'expense', 'asset', 'liability', 'equity', 'cash',
                    'name', 'category', 'type', 'balance'
                ]):
                    header_indicators += 1
                
                # Headers are usually text, not numbers
                if not isinstance(cell_value, (int, float)):
                    header_indicators += 0.5
        
        return header_indicators >= (total_cells * 0.6) if total_cells > 0 else False
    
    def _validate_financial_statements(self, sheets_info: List[ExcelSheetInfo], workbook) -> FileValidationResult:
        """Validate the Excel file for financial statement patterns."""
        errors = []
        warnings = []
        sheet_info = {}
        column_mapping = {}
        
        # Check if we have at least one sheet with financial data
        financial_sheets = []
        for sheet in sheets_info:
            sheet_type = self._identify_sheet_type(sheet)
            if sheet_type:
                financial_sheets.append({
                    'name': sheet.name,
                    'type': sheet_type,
                    'columns': sheet.columns
                })
                sheet_info[sheet.name] = sheet_type
        
        if not financial_sheets:
            errors.append("No recognizable financial statement sheets found")
        else:
            # Validate each financial sheet
            for fs_sheet in financial_sheets:
                validation_errors, mapping = self._validate_sheet_structure(
                    fs_sheet, workbook[fs_sheet['name']]
                )
                errors.extend(validation_errors)
                if mapping:
                    column_mapping[fs_sheet['name']] = mapping
        
        # Check for common issues
        if len(sheets_info) == 0:
            errors.append("No sheets found in Excel file")
        
        # Calculate total row count across all sheets
        total_rows = sum(sheet.row_count for sheet in sheets_info)
        
        is_valid = len(errors) == 0
        
        return FileValidationResult(
            is_valid=is_valid,
            errors=errors,
            warnings=warnings,
            sheet_info=sheet_info,
            column_mapping=column_mapping,
            row_count=total_rows
        )
    
    def _identify_sheet_type(self, sheet_info: ExcelSheetInfo) -> Optional[str]:
        """Identify the type of financial statement from sheet name and columns."""
        name_lower = sheet_info.name.lower()
        columns_lower = [col.lower() for col in sheet_info.columns]
        
        # P&L indicators
        pnl_indicators = ['revenue', 'sales', 'income', 'expense', 'profit', 'loss', 'ebitda', 'operating']
        if any(indicator in name_lower for indicator in ['p&l', 'pnl', 'income', 'profit']):
            return 'pnl'
        if sum(1 for indicator in pnl_indicators if any(indicator in col for col in columns_lower)) >= 2:
            return 'pnl'
        
        # Balance Sheet indicators
        bs_indicators = ['asset', 'liability', 'equity', 'cash', 'receivable', 'payable', 'inventory']
        if any(indicator in name_lower for indicator in ['balance', 'bs', 'position']):
            return 'balance_sheet'
        if sum(1 for indicator in bs_indicators if any(indicator in col for col in columns_lower)) >= 2:
            return 'balance_sheet'
        
        # Cash Flow indicators
        cf_indicators = ['cash flow', 'operating', 'investing', 'financing', 'free cash']
        if any(indicator in name_lower for indicator in ['cash', 'flow', 'cf']):
            return 'cash_flow'
        if sum(1 for indicator in cf_indicators if any(indicator in col for col in columns_lower)) >= 1:
            return 'cash_flow'
        
        return None
    
    def _validate_sheet_structure(self, fs_sheet: Dict, sheet) -> Tuple[List[str], Dict[str, str]]:
        """Validate the structure of a financial statement sheet."""
        errors = []
        column_mapping = {}
        
        sheet_type = fs_sheet['type']
        required_columns = self.financial_templates[sheet_type]['required_columns']
        
        # Try to map columns
        for required_col in required_columns:
            mapped_col = self._find_matching_column(required_col, fs_sheet['columns'])
            if mapped_col:
                column_mapping[required_col] = mapped_col
            else:
                errors.append(f"Required column '{required_col}' not found in {fs_sheet['name']} sheet")
        
        # Check for numeric data in value columns
        value_columns = ['amount', 'value', 'balance']
        for col_name in fs_sheet['columns']:
            if any(val_col in col_name.lower() for val_col in value_columns):
                if not self._validate_numeric_column(sheet, col_name):
                    errors.append(f"Column '{col_name}' should contain numeric values")
        
        return errors, column_mapping
    
    def _find_matching_column(self, required_col: str, available_columns: List[str]) -> Optional[str]:
        """Find the best matching column for a required column."""
        required_lower = required_col.lower()
        
        # Exact match
        for col in available_columns:
            if col.lower() == required_lower:
                return col
        
        # Partial match
        for col in available_columns:
            if required_lower in col.lower() or col.lower() in required_lower:
                return col
        
        # Synonym matching
        synonyms = {
            'account': ['name', 'description', 'item', 'line'],
            'amount': ['value', 'balance', 'total', 'sum'],
            'period': ['date', 'year', 'month', 'time']
        }
        
        if required_lower in synonyms:
            for synonym in synonyms[required_lower]:
                for col in available_columns:
                    if synonym in col.lower():
                        return col
        
        return None
    
    def _validate_numeric_column(self, sheet, column_name: str) -> bool:
        """Validate that a column contains primarily numeric data."""
        # Find column index
        for col_idx in range(1, sheet.max_column + 1):
            if sheet.cell(row=1, column=col_idx).value == column_name:
                break
        else:
            return False
        
        # Check first 10 data rows
        numeric_count = 0
        total_count = 0
        
        for row_idx in range(2, min(12, sheet.max_row + 1)):
            cell_value = sheet.cell(row=row_idx, column=col_idx).value
            if cell_value is not None:
                total_count += 1
                if isinstance(cell_value, (int, float)):
                    numeric_count += 1
                elif isinstance(cell_value, str) and self._is_numeric_string(cell_value):
                    numeric_count += 1
        
        return (numeric_count / total_count) >= 0.7 if total_count > 0 else False
    
    def _is_numeric_string(self, value: str) -> bool:
        """Check if a string represents a numeric value."""
        # Remove common formatting
        cleaned = value.replace(',', '').replace('$', '').replace('(', '-').replace(')', '').strip()
        try:
            float(cleaned)
            return True
        except ValueError:
            return False
    
    def _extract_financial_statements(self, workbook, validation_result: FileValidationResult) -> Dict[str, Any]:
        """Extract structured financial statement data."""
        financial_statements = {}
        
        for sheet_name, sheet_type in validation_result.sheet_info.items():
            sheet = workbook[sheet_name]
            column_mapping = validation_result.column_mapping.get(sheet_name, {})
            
            statement_data = self._extract_sheet_data(sheet, sheet_type, column_mapping)
            financial_statements[sheet_name] = {
                'type': sheet_type,
                'data': statement_data
            }
        
        return financial_statements
    
    def _extract_sheet_data(self, sheet, sheet_type: str, column_mapping: Dict[str, str]) -> List[Dict[str, Any]]:
        """Extract data from a financial statement sheet."""
        data = []
        
        # Find header row
        header_row = 1
        headers = []
        for col_idx in range(1, sheet.max_column + 1):
            cell_value = sheet.cell(row=header_row, column=col_idx).value
            headers.append(str(cell_value) if cell_value else f"Column_{col_idx}")
        
        # Extract data rows
        for row_idx in range(header_row + 1, sheet.max_row + 1):
            row_data = {}
            has_data = False
            
            for col_idx, header in enumerate(headers, 1):
                cell_value = sheet.cell(row=row_idx, column=col_idx).value
                if cell_value is not None:
                    has_data = True
                    # Convert to appropriate type
                    if isinstance(cell_value, (int, float)):
                        row_data[header] = cell_value
                    elif isinstance(cell_value, str) and self._is_numeric_string(cell_value):
                        row_data[header] = self._parse_numeric_string(cell_value)
                    else:
                        row_data[header] = str(cell_value)
                else:
                    row_data[header] = None
            
            if has_data:
                data.append(row_data)
        
        return data
    
    def _parse_numeric_string(self, value: str) -> float:
        """Parse a string to extract numeric value."""
        cleaned = value.replace(',', '').replace('$', '').replace('(', '-').replace(')', '').strip()
        try:
            return float(cleaned)
        except ValueError:
            return 0.0
    
    def _extract_key_metrics(self, workbook, financial_statements: Dict[str, Any]) -> Dict[str, Any]:
        """Extract key financial metrics from statements."""
        metrics = {}
        
        # Extract common metrics from P&L
        pnl_sheets = [name for name, data in financial_statements.items() if data['type'] == 'pnl']
        if pnl_sheets:
            pnl_data = financial_statements[pnl_sheets[0]]['data']
            metrics['revenue'] = self._find_metric_value(pnl_data, ['revenue', 'sales', 'income'])
            metrics['expenses'] = self._find_metric_value(pnl_data, ['expense', 'cost', 'operating'])
            metrics['profit'] = self._find_metric_value(pnl_data, ['profit', 'net income', 'earnings'])
        
        # Extract metrics from Balance Sheet
        bs_sheets = [name for name, data in financial_statements.items() if data['type'] == 'balance_sheet']
        if bs_sheets:
            bs_data = financial_statements[bs_sheets[0]]['data']
            metrics['total_assets'] = self._find_metric_value(bs_data, ['total assets', 'assets'])
            metrics['total_liabilities'] = self._find_metric_value(bs_data, ['total liabilities', 'liabilities'])
            metrics['equity'] = self._find_metric_value(bs_data, ['equity', 'shareholders equity'])
        
        return metrics
    
    def _find_metric_value(self, data: List[Dict[str, Any]], search_terms: List[str]) -> Optional[float]:
        """Find a metric value by searching for terms in the data."""
        for row in data:
            for key, value in row.items():
                if key and isinstance(value, (int, float)):
                    key_lower = key.lower()
                    if any(term.lower() in key_lower for term in search_terms):
                        return float(value)
        return None
    
    def _extract_assumptions(self, workbook) -> Dict[str, Any]:
        """Extract key assumptions from the Excel file."""
        assumptions = {}
        
        # Look for assumption sheets or cells with assumption data
        assumption_keywords = ['assumption', 'input', 'parameter', 'variable']
        
        for sheet_name in workbook.sheetnames:
            if any(keyword in sheet_name.lower() for keyword in assumption_keywords):
                sheet = workbook[sheet_name]
                sheet_assumptions = self._extract_assumption_data(sheet)
                assumptions[sheet_name] = sheet_assumptions
        
        return assumptions
    
    def _extract_assumption_data(self, sheet) -> Dict[str, Any]:
        """Extract assumption data from a sheet."""
        assumptions = {}
        
        # Look for key-value pairs in the sheet
        for row_idx in range(1, min(50, sheet.max_row + 1)):  # Check first 50 rows
            for col_idx in range(1, min(10, sheet.max_column + 1)):  # Check first 10 columns
                key_cell = sheet.cell(row=row_idx, column=col_idx)
                value_cell = sheet.cell(row=row_idx, column=col_idx + 1)
                
                if (key_cell.value and value_cell.value and 
                    isinstance(key_cell.value, str) and 
                    isinstance(value_cell.value, (int, float))):
                    
                    key = str(key_cell.value).strip()
                    value = float(value_cell.value)
                    
                    # Filter for assumption-like keys
                    if any(keyword in key.lower() for keyword in [
                        'rate', 'growth', 'margin', 'factor', 'ratio', 'percent', '%'
                    ]):
                        assumptions[key] = value
        
        return assumptions
    
    def _get_pnl_template(self) -> TemplateValidationConfig:
        """Get P&L template configuration."""
        return TemplateValidationConfig(
            template_type='pnl',
            required_columns=['account', 'amount'],
            optional_columns=['description', 'period', 'category'],
            validation_rules={
                'amount': {'type': 'numeric', 'required': True},
                'account': {'type': 'text', 'required': True}
            }
        )
    
    def _get_balance_sheet_template(self) -> TemplateValidationConfig:
        """Get Balance Sheet template configuration."""
        return TemplateValidationConfig(
            template_type='balance_sheet',
            required_columns=['account', 'amount'],
            optional_columns=['description', 'category', 'classification'],
            validation_rules={
                'amount': {'type': 'numeric', 'required': True},
                'account': {'type': 'text', 'required': True}
            }
        )
    
    def _get_cash_flow_template(self) -> TemplateValidationConfig:
        """Get Cash Flow template configuration."""
        return TemplateValidationConfig(
            template_type='cash_flow',
            required_columns=['account', 'amount'],
            optional_columns=['description', 'category', 'classification'],
            validation_rules={
                'amount': {'type': 'numeric', 'required': True},
                'account': {'type': 'text', 'required': True}
            }
        ) 