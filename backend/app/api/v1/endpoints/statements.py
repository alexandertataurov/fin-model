from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.models.base import get_db
from app.models.user import User
from app.models.financial import FinancialStatement, StatementType
from app.schemas.financial import (
    FinancialStatementResponse,
    FinancialStatementCreate,
    FinancialStatementUpdate,
    FinancialStatementListResponse,
)
from app.api.v1.endpoints.auth import get_current_active_user

router = APIRouter()


@router.get("/", response_model=List[FinancialStatementResponse])
def list_statements(
    skip: int = Query(0, ge=0, description="Number of statements to skip"),
    limit: int = Query(
        100, ge=1, le=1000, description="Number of statements to return"
    ),
    statement_type: Optional[StatementType] = Query(
        None, description="Filter by statement type"
    ),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Get list of financial statements for the current user.
    """
    query = db.query(FinancialStatement).filter(
        FinancialStatement.created_by_id == current_user.id
    )

    if statement_type:
        query = query.filter(FinancialStatement.statement_type == statement_type.value)

    statements = query.offset(skip).limit(limit).all()

    return [FinancialStatementResponse.from_orm(stmt) for stmt in statements]


@router.get("/{statement_id}", response_model=FinancialStatementResponse)
def get_statement(
    statement_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Get details of a specific financial statement.
    """
    statement = (
        db.query(FinancialStatement)
        .filter(
            FinancialStatement.id == statement_id,
            FinancialStatement.created_by_id == current_user.id,
        )
        .first()
    )

    if not statement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Financial statement not found",
        )

    return FinancialStatementResponse.from_orm(statement)


@router.get("/{statement_id}/data")
def get_statement_data(
    statement_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Get the financial data of a specific statement.
    """
    statement = (
        db.query(FinancialStatement)
        .filter(
            FinancialStatement.id == statement_id,
            FinancialStatement.created_by_id == current_user.id,
        )
        .first()
    )

    if not statement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Financial statement not found",
        )

    return {
        "statement_id": statement.id,
        "statement_type": statement.statement_type,
        "period_start": statement.period_start,
        "period_end": statement.period_end,
        "currency": statement.currency,
        "line_items": statement.line_items,
        "raw_data": statement.raw_data,
        "calculated_data": statement.calculated_data,
        "version": statement.version,
        "is_baseline": statement.is_baseline,
    }


@router.put("/{statement_id}", response_model=FinancialStatementResponse)
def update_statement(
    statement_id: int,
    statement_update: FinancialStatementUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Update statement metadata.
    """
    statement = (
        db.query(FinancialStatement)
        .filter(
            FinancialStatement.id == statement_id,
            FinancialStatement.created_by_id == current_user.id,
        )
        .first()
    )

    if not statement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Financial statement not found",
        )

    # Update fields that are provided
    update_data = statement_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(statement, field, value)

    # Increment version for data changes
    if any(
        field in update_data for field in ["line_items", "raw_data", "calculated_data"]
    ):
        statement.version += 1

    db.commit()
    db.refresh(statement)

    return FinancialStatementResponse.from_orm(statement)


@router.delete("/{statement_id}")
def delete_statement(
    statement_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Delete a financial statement.
    """
    statement = (
        db.query(FinancialStatement)
        .filter(
            FinancialStatement.id == statement_id,
            FinancialStatement.created_by_id == current_user.id,
        )
        .first()
    )

    if not statement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Financial statement not found",
        )

    db.delete(statement)
    db.commit()

    return {"message": "Financial statement deleted successfully"}


@router.post("/{statement_id}/validate")
def validate_statement(
    statement_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Validate a financial statement for consistency and accuracy.
    """
    statement = (
        db.query(FinancialStatement)
        .filter(
            FinancialStatement.id == statement_id,
            FinancialStatement.created_by_id == current_user.id,
        )
        .first()
    )

    if not statement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Financial statement not found",
        )

    # Import validation service
    from app.services.advanced_validator import AdvancedValidator

    validator = AdvancedValidator()
    validation_result = validator.validate_financial_statement(statement)

    return {
        "statement_id": statement.id,
        "is_valid": validation_result.is_valid,
        "validation_errors": validation_result.validation_errors,
        "warnings": validation_result.warnings,
        "validation_summary": validation_result.summary,
    }


@router.get("/{statement_id}/metrics")
def get_statement_metrics(
    statement_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Get calculated financial metrics for a statement.
    """
    statement = (
        db.query(FinancialStatement)
        .filter(
            FinancialStatement.id == statement_id,
            FinancialStatement.created_by_id == current_user.id,
        )
        .first()
    )

    if not statement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Financial statement not found",
        )

    # Import financial extractor for metrics calculation
    from app.services.financial_extractor import FinancialExtractor

    extractor = FinancialExtractor()
    metrics = extractor.calculate_statement_metrics(statement)

    return {
        "statement_id": statement.id,
        "statement_type": statement.statement_type,
        "period": f"{statement.period_start} to {statement.period_end}",
        "metrics": metrics,
    }


@router.post("/{statement_id}/compare/{compare_statement_id}")
def compare_statements(
    statement_id: int,
    compare_statement_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Compare two financial statements.
    """
    # Get both statements
    statement1 = (
        db.query(FinancialStatement)
        .filter(
            FinancialStatement.id == statement_id,
            FinancialStatement.created_by_id == current_user.id,
        )
        .first()
    )

    statement2 = (
        db.query(FinancialStatement)
        .filter(
            FinancialStatement.id == compare_statement_id,
            FinancialStatement.created_by_id == current_user.id,
        )
        .first()
    )

    if not statement1 or not statement2:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="One or both financial statements not found",
        )

    if statement1.statement_type != statement2.statement_type:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot compare statements of different types",
        )

    # Import comparison service
    from app.services.financial_extractor import FinancialExtractor

    extractor = FinancialExtractor()
    comparison = extractor.compare_statements(statement1, statement2)

    return {
        "statement1_id": statement1.id,
        "statement2_id": statement2.id,
        "statement_type": statement1.statement_type,
        "comparison_result": comparison,
    }
