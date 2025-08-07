"""
Lean Financial Modeling API Endpoints
Core endpoints for the lean financial modeling application
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, List, Any, Optional
from datetime import datetime

from app.core.dependencies import get_db, get_current_user
from app.models.user import User
from app.services.lean_financial_engine import LeanFinancialEngine, CoreParameters, StatementType
from app.services.lean_parameter_manager import LeanParameterManager, ParameterCategory
from pydantic import BaseModel, Field


router = APIRouter()


# Pydantic models for API requests/responses
class ParameterUpdateRequest(BaseModel):
    parameters: Dict[str, float] = Field(..., description="Parameter key-value pairs to update")
    base_revenue: Optional[float] = Field(1000000, description="Base revenue for calculations")


class ScenarioCreateRequest(BaseModel):
    scenario_name: str = Field(..., description="Name for the scenario")
    parameters: Dict[str, float] = Field(..., description="Parameter values for scenario")
    base_revenue: Optional[float] = Field(1000000, description="Base revenue for calculations")


class SensitivityAnalysisRequest(BaseModel):
    base_parameters: Dict[str, float] = Field(..., description="Base parameter values")
    sensitivity_parameters: Optional[List[str]] = Field(None, description="Parameters to analyze")
    variation_percent: Optional[float] = Field(0.20, description="Variation percentage for sensitivity")


class ParameterImpactRequest(BaseModel):
    parameter_key: str = Field(..., description="Parameter to analyze")
    old_value: float = Field(..., description="Current parameter value")
    new_value: float = Field(..., description="New parameter value")
    base_parameters: Dict[str, float] = Field(..., description="Base parameter values")


class FinancialModelResponse(BaseModel):
    profit_loss: Dict[str, Any]
    balance_sheet: Dict[str, Any]
    cash_flow: Dict[str, Any]
    dcf_valuation: Dict[str, Any]
    parameters: Dict[str, Any]
    calculation_timestamp: datetime
    model_version: str


@router.get("/parameters/categories")
async def get_parameter_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all parameter categories and their definitions"""
    try:
        param_manager = LeanParameterManager(db)
        parameter_groups = param_manager.get_parameter_groups()
        
        result = {}
        for category, group in parameter_groups.items():
            result[category.value] = {
                'name': group.name,
                'description': group.description,
                'display_order': group.display_order,
                'parameters': [
                    {
                        'name': param.name,
                        'key': param.key,
                        'parameter_type': param.parameter_type.value,
                        'default_value': param.default_value,
                        'min_value': param.min_value,
                        'max_value': param.max_value,
                        'description': param.description,
                        'sensitivity_level': param.sensitivity_level.value,
                        'unit': param.unit,
                        'dependencies': param.dependencies
                    }
                    for param in group.parameters
                ]
            }
        
        return {
            'success': True,
            'data': result,
            'total_categories': len(result)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get parameter categories: {str(e)}"
        )


@router.get("/parameters/category/{category}")
async def get_parameter_category(
    category: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get parameters for a specific category"""
    try:
        param_manager = LeanParameterManager(db)
        
        try:
            category_enum = ParameterCategory(category)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid parameter category: {category}"
            )
        
        parameter_group = param_manager.get_parameter_group(category_enum)
        
        if not parameter_group:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Parameter category not found: {category}"
            )
        
        return {
            'success': True,
            'data': {
                'name': parameter_group.name,
                'description': parameter_group.description,
                'display_order': parameter_group.display_order,
                'parameters': [
                    {
                        'name': param.name,
                        'key': param.key,
                        'parameter_type': param.parameter_type.value,
                        'default_value': param.default_value,
                        'min_value': param.min_value,
                        'max_value': param.max_value,
                        'description': param.description,
                        'sensitivity_level': param.sensitivity_level.value,
                        'unit': param.unit,
                        'dependencies': param.dependencies
                    }
                    for param in parameter_group.parameters
                ]
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get parameter category: {str(e)}"
        )


@router.get("/parameters/templates")
async def get_parameter_templates(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get predefined parameter templates"""
    try:
        param_manager = LeanParameterManager(db)
        templates = param_manager.create_scenario_templates()
        
        return {
            'success': True,
            'data': templates,
            'template_count': len(templates)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get parameter templates: {str(e)}"
        )


@router.post("/calculate/comprehensive")
async def calculate_comprehensive_model(
    request: ParameterUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Calculate comprehensive financial model with P&L, Balance Sheet, Cash Flow, and DCF"""
    try:
        param_manager = LeanParameterManager(db)
        engine = LeanFinancialEngine(db)
        
        # Validate parameters
        is_valid, errors = param_manager.validate_parameters(request.parameters)
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Parameter validation failed: {errors}"
            )
        
        # Create CoreParameters from request
        core_parameters = param_manager.create_core_parameters_from_dict(request.parameters)
        
        # Calculate comprehensive model
        model_result = engine.calculate_comprehensive_model(core_parameters, request.base_revenue)
        
        # Convert dataclass objects to dictionaries for JSON serialization
        response_data = {
            'profit_loss': model_result['profit_loss'].__dict__,
            'balance_sheet': model_result['balance_sheet'].__dict__,
            'cash_flow': model_result['cash_flow'].__dict__,
            'dcf_valuation': model_result['dcf_valuation'].__dict__,
            'parameters': model_result['parameters'].__dict__,
            'calculation_timestamp': model_result['calculation_timestamp'],
            'model_version': model_result['model_version']
        }
        
        return {
            'success': True,
            'data': response_data
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to calculate comprehensive model: {str(e)}"
        )


@router.post("/calculate/statement/{statement_type}")
async def calculate_individual_statement(
    statement_type: str,
    request: ParameterUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Calculate individual financial statement"""
    try:
        param_manager = LeanParameterManager(db)
        engine = LeanFinancialEngine(db)
        
        # Validate statement type
        valid_types = ['profit_loss', 'balance_sheet', 'cash_flow', 'dcf_valuation']
        if statement_type not in valid_types:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid statement type. Must be one of: {valid_types}"
            )
        
        # Validate parameters
        is_valid, errors = param_manager.validate_parameters(request.parameters)
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Parameter validation failed: {errors}"
            )
        
        # Create CoreParameters from request
        core_parameters = param_manager.create_core_parameters_from_dict(request.parameters)
        
        # Calculate specific statement
        if statement_type == 'profit_loss':
            result = engine.calculate_profit_loss(core_parameters, request.base_revenue)
        elif statement_type == 'balance_sheet':
            pl_statement = engine.calculate_profit_loss(core_parameters, request.base_revenue)
            result = engine.calculate_balance_sheet(core_parameters, pl_statement)
        elif statement_type == 'cash_flow':
            pl_statement = engine.calculate_profit_loss(core_parameters, request.base_revenue)
            balance_sheet = engine.calculate_balance_sheet(core_parameters, pl_statement)
            result = engine.calculate_cash_flow(core_parameters, pl_statement, balance_sheet)
        elif statement_type == 'dcf_valuation':
            result = engine.calculate_dcf_valuation(core_parameters, request.base_revenue)
        
        return {
            'success': True,
            'statement_type': statement_type,
            'data': result.__dict__,
            'calculation_timestamp': datetime.utcnow()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to calculate {statement_type}: {str(e)}"
        )


@router.post("/scenarios/create")
async def create_scenario(
    request: ScenarioCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new financial scenario"""
    try:
        param_manager = LeanParameterManager(db)
        engine = LeanFinancialEngine(db)
        
        # Validate parameters
        is_valid, errors = param_manager.validate_parameters(request.parameters)
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Parameter validation failed: {errors}"
            )
        
        # Create CoreParameters from request
        core_parameters = param_manager.create_core_parameters_from_dict(request.parameters)
        
        # Create scenario
        scenario_result = engine.create_scenario(request.scenario_name, core_parameters, request.base_revenue)
        
        # Convert dataclass objects to dictionaries
        response_data = {
            'scenario_name': scenario_result['scenario_name'],
            'scenario_id': scenario_result['scenario_id'],
            'created_at': scenario_result['created_at'],
            'profit_loss': scenario_result['profit_loss'].__dict__,
            'balance_sheet': scenario_result['balance_sheet'].__dict__,
            'cash_flow': scenario_result['cash_flow'].__dict__,
            'dcf_valuation': scenario_result['dcf_valuation'].__dict__,
            'parameters': scenario_result['parameters'].__dict__
        }
        
        return {
            'success': True,
            'data': response_data
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create scenario: {str(e)}"
        )


@router.post("/scenarios/compare")
async def compare_scenarios(
    scenarios: List[Dict[str, Any]],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Compare multiple scenarios"""
    try:
        engine = LeanFinancialEngine(db)
        
        # Compare scenarios
        comparison_result = engine.compare_scenarios(scenarios)
        
        return {
            'success': True,
            'data': comparison_result,
            'comparison_timestamp': datetime.utcnow()
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to compare scenarios: {str(e)}"
        )


@router.post("/analysis/sensitivity")
async def create_sensitivity_analysis(
    request: SensitivityAnalysisRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create sensitivity analysis for key parameters"""
    try:
        param_manager = LeanParameterManager(db)
        
        # Create CoreParameters from request
        base_parameters = param_manager.create_core_parameters_from_dict(request.base_parameters)
        
        # Create sensitivity analysis
        sensitivity_result = param_manager.create_sensitivity_analysis(
            base_parameters, 
            request.sensitivity_parameters, 
            request.variation_percent
        )
        
        return {
            'success': True,
            'data': sensitivity_result,
            'analysis_timestamp': datetime.utcnow()
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create sensitivity analysis: {str(e)}"
        )


@router.post("/analysis/parameter-impact")
async def analyze_parameter_impact(
    request: ParameterImpactRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Analyze the impact of changing a specific parameter"""
    try:
        param_manager = LeanParameterManager(db)
        
        # Create CoreParameters from request
        base_parameters = param_manager.create_core_parameters_from_dict(request.base_parameters)
        
        # Calculate parameter impact
        impact_result = param_manager.calculate_parameter_impact(
            request.parameter_key,
            request.old_value,
            request.new_value,
            base_parameters
        )
        
        return {
            'success': True,
            'data': impact_result,
            'analysis_timestamp': datetime.utcnow()
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze parameter impact: {str(e)}"
        )


@router.post("/parameters/validate")
async def validate_parameters(
    parameters: Dict[str, float],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Validate parameter values"""
    try:
        param_manager = LeanParameterManager(db)
        
        is_valid, errors = param_manager.validate_parameters(parameters)
        
        return {
            'success': True,
            'valid': is_valid,
            'errors': errors,
            'validation_timestamp': datetime.utcnow()
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to validate parameters: {str(e)}"
        )


@router.get("/parameters/export")
async def export_parameters(
    format: str = "json",
    template: str = "base_case",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Export parameters in specified format"""
    try:
        param_manager = LeanParameterManager(db)
        
        # Get template parameters
        templates = param_manager.create_scenario_templates()
        if template not in templates:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Template not found: {template}"
            )
        
        # Create CoreParameters from template
        core_parameters = param_manager.create_core_parameters_from_dict(templates[template])
        
        # Export parameters
        exported_data = param_manager.export_parameters(core_parameters, format)
        
        return {
            'success': True,
            'format': format,
            'template': template,
            'data': exported_data,
            'export_timestamp': datetime.utcnow()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to export parameters: {str(e)}"
        )


@router.get("/health")
async def health_check():
    """Health check endpoint for lean financial engine"""
    try:
        # Basic health check - ensure we can import core modules
        from app.services.lean_financial_engine import LeanFinancialEngine, CoreParameters
        from app.services.lean_parameter_manager import LeanParameterManager
        
        return {
            'success': True,
            'status': 'healthy',
            'service': 'lean_financial_engine',
            'version': '1.0-lean',
            'timestamp': datetime.utcnow()
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Health check failed: {str(e)}"
        )