import re
from typing import Dict, List, Any, Optional, Tuple, Set
from enum import Enum
from dataclasses import dataclass, field
from app.services.excel_parser import ParsedData, SheetInfo, CellInfo, DataType, SheetType, ValidationError


class TemplateType(str, Enum):
    """Types of financial statement templates."""
    PROFIT_LOSS = "profit_loss"
    BALANCE_SHEET = "balance_sheet"
    CASH_FLOW = "cash_flow"
    TRIAL_BALANCE = "trial_balance"
    BUDGET = "budget"
    FORECAST = "forecast"
    GENERAL = "general"


class ValidationSeverity(str, Enum):
    """Validation severity levels."""
    CRITICAL = "critical"
    ERROR = "error"
    WARNING = "warning"
    INFO = "info"
    SUGGESTION = "suggestion"


@dataclass
class ColumnMapping:
    """Information about a detected column."""
    column_index: int
    column_letter: str
    expected_name: str
    detected_name: str
    confidence: float
    data_type: str
    sample_values: List[Any] = field(default_factory=list)


@dataclass
class TemplateValidationResult:
    """Result of template validation."""
    template_type: TemplateType
    is_valid: bool
    confidence_score: float
    detected_columns: List[ColumnMapping] = field(default_factory=list)
    missing_columns: List[str] = field(default_factory=list)
    validation_errors: List[ValidationError] = field(default_factory=list)
    suggestions: List[str] = field(default_factory=list)
    data_quality_score: float = 0.0
    compliance_score: float = 0.0


@dataclass
class FinancialSection:
    """A section within a financial statement."""
    name: str
    section_type: str
    start_row: int
    end_row: int
    accounts: List[str] = field(default_factory=list)
    values: List[float] = field(default_factory=list)
    formulas: List[str] = field(default_factory=list)


class AdvancedValidator:
    """Advanced template validation for financial statements."""
    
    def __init__(self):
        self._initialize_templates()
        self._initialize_patterns()
    
    def _initialize_templates(self):
        """Initialize template definitions."""
        
        # Profit & Loss Statement Template
        self.pl_template = {
            "required_columns": [
                "account", "description", "current_period", "prior_period"
            ],
            "optional_columns": [
                "budget", "variance", "ytd_actual", "ytd_budget"
            ],
            "required_sections": [
                "revenue", "cost_of_sales", "gross_profit", 
                "operating_expenses", "operating_income", "net_income"
            ],
            "section_patterns": {
                "revenue": [r"revenue", r"sales", r"income", r"turnover"],
                "cost_of_sales": [r"cost.*sales", r"cogs", r"cost.*goods"],
                "gross_profit": [r"gross.*profit", r"gross.*margin"],
                "operating_expenses": [r"operating.*expense", r"opex", r"sg&a"],
                "operating_income": [r"operating.*income", r"ebit"],
                "net_income": [r"net.*income", r"net.*profit", r"bottom.*line"]
            },
            "calculation_rules": [
                ("gross_profit", "revenue - cost_of_sales"),
                ("operating_income", "gross_profit - operating_expenses"),
                ("net_income", "operating_income - taxes - interest")
            ]
        }
        
        # Balance Sheet Template
        self.bs_template = {
            "required_columns": [
                "account", "description", "current_year", "prior_year"
            ],
            "optional_columns": [
                "notes", "budget", "variance"
            ],
            "required_sections": [
                "assets", "current_assets", "non_current_assets",
                "liabilities", "current_liabilities", "non_current_liabilities",
                "equity", "total_assets", "total_liabilities_equity"
            ],
            "section_patterns": {
                "assets": [r"assets", r"total.*assets"],
                "current_assets": [r"current.*assets", r"cash", r"receivables", r"inventory"],
                "non_current_assets": [r"non.*current", r"fixed.*assets", r"ppe", r"property"],
                "liabilities": [r"liabilities", r"total.*liabilities"],
                "current_liabilities": [r"current.*liabilities", r"payables", r"accrued"],
                "non_current_liabilities": [r"non.*current.*liabilities", r"long.*term.*debt"],
                "equity": [r"equity", r"shareholders", r"retained.*earnings"]
            },
            "balance_rules": [
                ("total_assets", "current_assets + non_current_assets"),
                ("total_liabilities", "current_liabilities + non_current_liabilities"),
                ("balance_check", "total_assets = total_liabilities + equity")
            ]
        }
        
        # Cash Flow Statement Template
        self.cf_template = {
            "required_columns": [
                "description", "current_period", "prior_period"
            ],
            "optional_columns": [
                "budget", "variance", "notes"
            ],
            "required_sections": [
                "operating_activities", "investing_activities", "financing_activities",
                "net_cash_flow", "beginning_cash", "ending_cash"
            ],
            "section_patterns": {
                "operating_activities": [r"operating.*activities", r"cash.*operations"],
                "investing_activities": [r"investing.*activities", r"capex", r"investments"],
                "financing_activities": [r"financing.*activities", r"debt", r"equity"],
                "net_cash_flow": [r"net.*cash.*flow", r"change.*cash"],
                "beginning_cash": [r"beginning.*cash", r"opening.*cash"],
                "ending_cash": [r"ending.*cash", r"closing.*cash"]
            },
            "flow_rules": [
                ("net_cash_flow", "operating + investing + financing"),
                ("ending_cash", "beginning_cash + net_cash_flow")
            ]
        }
        
        self.templates = {
            TemplateType.PROFIT_LOSS: self.pl_template,
            TemplateType.BALANCE_SHEET: self.bs_template,
            TemplateType.CASH_FLOW: self.cf_template
        }
    
    def _initialize_patterns(self):
        """Initialize recognition patterns."""
        
        # Common account patterns
        self.account_patterns = {
            "revenue": [
                r"revenue", r"sales", r"income", r"turnover", r"receipts"
            ],
            "expenses": [
                r"expense", r"cost", r"expenditure", r"outlay", r"payment"
            ],
            "assets": [
                r"asset", r"cash", r"receivable", r"inventory", r"equipment"
            ],
            "liabilities": [
                r"liability", r"payable", r"debt", r"loan", r"obligation"
            ],
            "equity": [
                r"equity", r"capital", r"retained", r"earnings", r"surplus"
            ]
        }
        
        # Date/period patterns
        self.period_patterns = [
            r"\d{4}",  # 2023
            r"(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)",
            r"(q1|q2|q3|q4)",
            r"(fy|year)",
            r"(current|prior|actual|budget|forecast)",
            r"\d{1,2}/\d{1,2}/\d{2,4}"
        ]
        
        # Amount/value patterns
        self.amount_patterns = [
            r"amount", r"value", r"balance", r"total", r"\$", r"usd", r"eur"
        ]
    
    def validate_template(self, parsed_data: ParsedData, template_type: Optional[TemplateType] = None) -> TemplateValidationResult:
        """
        Validate parsed Excel data against financial statement templates.
        
        Args:
            parsed_data: Parsed Excel data
            template_type: Specific template to validate against (auto-detect if None)
            
        Returns:
            Template validation result
        """
        if not parsed_data.sheets:
            return TemplateValidationResult(
                template_type=TemplateType.GENERAL,
                is_valid=False,
                confidence_score=0.0,
                validation_errors=[
                    ValidationError(
                        severity="error",
                        message="No worksheets found to validate"
                    )
                ]
            )
        
        # Auto-detect template type if not specified
        if template_type is None:
            template_type = self._detect_template_type(parsed_data)
        
        # Find the best sheet for validation
        target_sheet = self._find_primary_sheet(parsed_data, template_type)
        
        if not target_sheet:
            return TemplateValidationResult(
                template_type=template_type,
                is_valid=False,
                confidence_score=0.0,
                validation_errors=[
                    ValidationError(
                        severity="error",
                        message=f"No suitable sheet found for {template_type.value} validation"
                    )
                ]
            )
        
        # Perform validation
        return self._validate_sheet_against_template(target_sheet, template_type)
    
    def _detect_template_type(self, parsed_data: ParsedData) -> TemplateType:
        """Auto-detect the template type from sheet content."""
        
        # Score each template type
        scores = {
            TemplateType.PROFIT_LOSS: 0,
            TemplateType.BALANCE_SHEET: 0,
            TemplateType.CASH_FLOW: 0
        }
        
        for sheet in parsed_data.sheets:
            # Check sheet type first
            if sheet.sheet_type == SheetType.PROFIT_LOSS:
                scores[TemplateType.PROFIT_LOSS] += 10
            elif sheet.sheet_type == SheetType.BALANCE_SHEET:
                scores[TemplateType.BALANCE_SHEET] += 10
            elif sheet.sheet_type == SheetType.CASH_FLOW:
                scores[TemplateType.CASH_FLOW] += 10
            
            # Check content patterns
            sheet_text = self._extract_sheet_text(sheet)
            
            # P&L patterns
            for pattern in self.pl_template["section_patterns"]["revenue"]:
                if re.search(pattern, sheet_text, re.IGNORECASE):
                    scores[TemplateType.PROFIT_LOSS] += 2
            
            for pattern in self.pl_template["section_patterns"]["operating_expenses"]:
                if re.search(pattern, sheet_text, re.IGNORECASE):
                    scores[TemplateType.PROFIT_LOSS] += 2
            
            # Balance sheet patterns
            for pattern in self.bs_template["section_patterns"]["assets"]:
                if re.search(pattern, sheet_text, re.IGNORECASE):
                    scores[TemplateType.BALANCE_SHEET] += 2
            
            for pattern in self.bs_template["section_patterns"]["liabilities"]:
                if re.search(pattern, sheet_text, re.IGNORECASE):
                    scores[TemplateType.BALANCE_SHEET] += 2
            
            # Cash flow patterns
            for pattern in self.cf_template["section_patterns"]["operating_activities"]:
                if re.search(pattern, sheet_text, re.IGNORECASE):
                    scores[TemplateType.CASH_FLOW] += 2
        
        # Return template with highest score
        max_template = max(scores.items(), key=lambda x: x[1])
        return max_template[0] if max_template[1] > 0 else TemplateType.GENERAL
    
    def _find_primary_sheet(self, parsed_data: ParsedData, template_type: TemplateType) -> Optional[SheetInfo]:
        """Find the primary sheet for validation."""
        
        # First, look for sheets with matching type
        type_mapping = {
            TemplateType.PROFIT_LOSS: SheetType.PROFIT_LOSS,
            TemplateType.BALANCE_SHEET: SheetType.BALANCE_SHEET,
            TemplateType.CASH_FLOW: SheetType.CASH_FLOW
        }
        
        target_sheet_type = type_mapping.get(template_type)
        if target_sheet_type:
            for sheet in parsed_data.sheets:
                if sheet.sheet_type == target_sheet_type:
                    return sheet
        
        # Fall back to sheet with most data
        if parsed_data.sheets:
            return max(parsed_data.sheets, key=lambda s: len(s.cells))
        
        return None
    
    def _extract_sheet_text(self, sheet: SheetInfo) -> str:
        """Extract all text content from a sheet."""
        text_content = []
        for cell in sheet.cells:
            if cell.data_type == DataType.TEXT and cell.value:
                text_content.append(str(cell.value))
        return " ".join(text_content)
    
    def _validate_sheet_against_template(self, sheet: SheetInfo, template_type: TemplateType) -> TemplateValidationResult:
        """Validate a sheet against a specific template."""
        
        template = self.templates[template_type]
        result = TemplateValidationResult(
            template_type=template_type,
            is_valid=True,
            confidence_score=0.0
        )
        
        # Detect column structure
        detected_columns = self._detect_columns(sheet, template)
        result.detected_columns = detected_columns
        
        # Check for required columns
        required_columns = set(template["required_columns"])
        detected_column_names = {col.expected_name for col in detected_columns}
        missing_columns = required_columns - detected_column_names
        result.missing_columns = list(missing_columns)
        
        # Validate required columns
        if missing_columns:
            for missing in missing_columns:
                result.validation_errors.append(
                    ValidationError(
                        severity="error",
                        message=f"Required column '{missing}' not found",
                        sheet=sheet.name,
                        suggestion=f"Add a column for {missing} or check column headers"
                    )
                )
            result.is_valid = False
        
        # Detect financial sections
        sections = self._detect_financial_sections(sheet, template)
        
        # Validate required sections
        required_sections = set(template["required_sections"])
        detected_section_names = {section.name for section in sections}
        missing_sections = required_sections - detected_section_names
        
        if missing_sections:
            for missing in missing_sections:
                result.validation_errors.append(
                    ValidationError(
                        severity="warning",
                        message=f"Expected section '{missing}' not clearly identified",
                        sheet=sheet.name,
                        suggestion=f"Consider adding clear section headers for {missing}"
                    )
                )
        
        # Validate data quality
        data_quality_score = self._calculate_data_quality_score(sheet, detected_columns)
        result.data_quality_score = data_quality_score
        
        # Validate compliance
        compliance_score = self._calculate_compliance_score(sheet, template, sections)
        result.compliance_score = compliance_score
        
        # Calculate overall confidence
        column_score = len(detected_columns) / len(template["required_columns"]) if template["required_columns"] else 1.0
        section_score = len(detected_section_names) / len(required_sections) if required_sections else 1.0
        result.confidence_score = (column_score + section_score + data_quality_score + compliance_score) / 4
        
        # Generate suggestions
        result.suggestions = self._generate_suggestions(sheet, template, result)
        
        return result
    
    def _detect_columns(self, sheet: SheetInfo, template: Dict[str, Any]) -> List[ColumnMapping]:
        """Detect column mappings in the sheet."""
        detected_columns = []
        
        if not sheet.header_row:
            return detected_columns
        
        # Get header row cells
        header_cells = [cell for cell in sheet.cells if cell.row == sheet.header_row]
        header_cells.sort(key=lambda c: c.column)
        
        required_columns = template["required_columns"] + template.get("optional_columns", [])
        
        for cell in header_cells:
            if not cell.value or cell.data_type != DataType.TEXT:
                continue
            
            header_text = str(cell.value).lower().strip()
            
            # Try to match with template columns
            best_match = None
            best_confidence = 0.0
            
            for col_name in required_columns:
                confidence = self._calculate_column_match_confidence(header_text, col_name)
                if confidence > best_confidence and confidence > 0.5:
                    best_confidence = confidence
                    best_match = col_name
            
            if best_match:
                # Get sample values from this column
                sample_values = self._get_column_sample_values(sheet, cell.column)
                
                detected_columns.append(ColumnMapping(
                    column_index=cell.column,
                    column_letter=cell.address[0],  # Simplified
                    expected_name=best_match,
                    detected_name=str(cell.value),
                    confidence=best_confidence,
                    data_type=self._infer_column_data_type(sample_values),
                    sample_values=sample_values[:5]  # First 5 samples
                ))
        
        return detected_columns
    
    def _calculate_column_match_confidence(self, header_text: str, expected_column: str) -> float:
        """Calculate confidence score for column matching."""
        
        # Direct match
        if header_text == expected_column:
            return 1.0
        
        # Partial matches
        confidence = 0.0
        
        # Check for keywords
        expected_words = expected_column.replace("_", " ").split()
        header_words = re.split(r'[_\s]+', header_text)
        
        matches = sum(1 for word in expected_words if any(word in hw for hw in header_words))
        if expected_words:
            confidence += (matches / len(expected_words)) * 0.8
        
        # Check for common synonyms
        synonyms = {
            "account": ["account", "description", "item", "line"],
            "current_period": ["current", "actual", "ytd", "2023", "2024"],
            "prior_period": ["prior", "previous", "py", "2022", "2023"],
            "description": ["description", "account", "item", "detail"],
            "amount": ["amount", "value", "balance", "total"]
        }
        
        if expected_column in synonyms:
            for synonym in synonyms[expected_column]:
                if synonym in header_text:
                    confidence += 0.3
                    break
        
        return min(confidence, 1.0)
    
    def _get_column_sample_values(self, sheet: SheetInfo, column: int) -> List[Any]:
        """Get sample values from a column."""
        column_cells = [cell for cell in sheet.cells if cell.column == column]
        column_cells.sort(key=lambda c: c.row)
        
        # Skip header row
        data_cells = [cell for cell in column_cells if cell.row > (sheet.header_row or 0)]
        
        return [cell.value for cell in data_cells[:10] if cell.value is not None]
    
    def _infer_column_data_type(self, sample_values: List[Any]) -> str:
        """Infer the data type of a column from sample values."""
        if not sample_values:
            return "unknown"
        
        numeric_count = sum(1 for v in sample_values if isinstance(v, (int, float)))
        text_count = sum(1 for v in sample_values if isinstance(v, str))
        
        if numeric_count > len(sample_values) * 0.8:
            return "numeric"
        elif text_count > len(sample_values) * 0.8:
            return "text"
        else:
            return "mixed"
    
    def _detect_financial_sections(self, sheet: SheetInfo, template: Dict[str, Any]) -> List[FinancialSection]:
        """Detect financial sections within the sheet."""
        sections = []
        
        section_patterns = template.get("section_patterns", {})
        
        for section_name, patterns in section_patterns.items():
            for cell in sheet.cells:
                if cell.data_type == DataType.TEXT and cell.value:
                    cell_text = str(cell.value).lower()
                    
                    for pattern in patterns:
                        if re.search(pattern, cell_text, re.IGNORECASE):
                            # Found a section header
                            section = FinancialSection(
                                name=section_name,
                                section_type="header",
                                start_row=cell.row,
                                end_row=cell.row + 10  # Estimate section size
                            )
                            sections.append(section)
                            break
        
        return sections
    
    def _calculate_data_quality_score(self, sheet: SheetInfo, columns: List[ColumnMapping]) -> float:
        """Calculate data quality score."""
        if not columns:
            return 0.0
        
        scores = []
        
        for column in columns:
            # Check data completeness
            total_cells = len([c for c in sheet.cells if c.column == column.column_index])
            non_empty_cells = len([c for c in sheet.cells 
                                 if c.column == column.column_index and c.value is not None])
            
            completeness = non_empty_cells / total_cells if total_cells > 0 else 0
            scores.append(completeness)
        
        return sum(scores) / len(scores) if scores else 0.0
    
    def _calculate_compliance_score(self, sheet: SheetInfo, template: Dict[str, Any], sections: List[FinancialSection]) -> float:
        """Calculate template compliance score."""
        
        required_sections = template.get("required_sections", [])
        detected_sections = {section.name for section in sections}
        
        if not required_sections:
            return 1.0
        
        compliance = len(detected_sections.intersection(required_sections)) / len(required_sections)
        return compliance
    
    def _generate_suggestions(self, sheet: SheetInfo, template: Dict[str, Any], result: TemplateValidationResult) -> List[str]:
        """Generate improvement suggestions."""
        suggestions = []
        
        # Missing columns suggestions
        if result.missing_columns:
            suggestions.append(
                f"Add columns for: {', '.join(result.missing_columns)}"
            )
        
        # Data quality suggestions
        if result.data_quality_score < 0.8:
            suggestions.append(
                "Consider filling in missing data values to improve data quality"
            )
        
        # Compliance suggestions
        if result.compliance_score < 0.7:
            suggestions.append(
                "Add clear section headers to improve template compliance"
            )
        
        # Formula suggestions
        if sheet.formula_count == 0:
            suggestions.append(
                "Consider adding formulas for calculated fields (totals, subtotals, etc.)"
            )
        
        return suggestions
    
    def get_template_requirements(self, template_type: TemplateType) -> Dict[str, Any]:
        """Get requirements for a specific template type."""
        template = self.templates.get(template_type)
        if not template:
            return {}
        
        return {
            "template_type": template_type.value,
            "required_columns": template["required_columns"],
            "optional_columns": template.get("optional_columns", []),
            "required_sections": template["required_sections"],
            "section_patterns": template.get("section_patterns", {}),
            "validation_rules": template.get("calculation_rules", [])
        }
    
    def suggest_template_improvements(self, parsed_data: ParsedData) -> Dict[str, Any]:
        """Suggest improvements for better template compliance."""
        
        suggestions = {
            "column_suggestions": [],
            "structure_suggestions": [],
            "data_suggestions": [],
            "formula_suggestions": []
        }
        
        # Detect most likely template type
        template_type = self._detect_template_type(parsed_data)
        template = self.templates[template_type]
        
        # Analyze current structure
        primary_sheet = self._find_primary_sheet(parsed_data, template_type)
        if not primary_sheet:
            return suggestions
        
        # Column suggestions
        detected_columns = self._detect_columns(primary_sheet, template)
        required_columns = set(template["required_columns"])
        detected_column_names = {col.expected_name for col in detected_columns}
        missing_columns = required_columns - detected_column_names
        
        for missing in missing_columns:
            suggestions["column_suggestions"].append({
                "type": "add_column",
                "column_name": missing,
                "description": f"Add {missing} column for {template_type.value} compliance"
            })
        
        # Structure suggestions
        if not primary_sheet.header_row:
            suggestions["structure_suggestions"].append({
                "type": "add_headers",
                "description": "Add clear column headers in the first row"
            })
        
        # Data suggestions
        for column in detected_columns:
            if column.confidence < 0.7:
                suggestions["data_suggestions"].append({
                    "type": "improve_column_naming",
                    "column": column.detected_name,
                    "suggestion": f"Consider renaming to '{column.expected_name}' for clarity"
                })
        
        # Formula suggestions
        if primary_sheet.formula_count < 3:
            suggestions["formula_suggestions"].append({
                "type": "add_calculations",
                "description": "Add formulas for totals and subtotals to improve model functionality"
            })
        
        return suggestions
