from typing import Generic, TypeVar, Type, List, Optional, Dict, Any, Union
from abc import ABC, abstractmethod
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import and_, or_, desc, asc, func
from sqlalchemy.orm.query import Query

from app.models.base import Base

# Generic type for model classes
ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType], ABC):
    """
    Base repository class implementing common database operations.

    Provides a consistent interface for data access operations across all models.
    Implements the Repository pattern to abstract database access logic.
    """

    def __init__(self, db: Session, model: Type[ModelType]):
        """
        Initialize repository with database session and model class.

        Args:
            db: SQLAlchemy database session
            model: SQLAlchemy model class
        """
        self.db = db
        self.model = model

    def get(self, id: int) -> Optional[ModelType]:
        """
        Get a single record by ID.

        Args:
            id: Primary key value

        Returns:
            Model instance or None if not found
        """
        try:
            return self.db.query(self.model).filter(self.model.id == id).first()
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e

    def get_multi(
        self,
        skip: int = 0,
        limit: int = 100,
        filters: Optional[Dict[str, Any]] = None,
        order_by: Optional[str] = None,
        order_desc: bool = False,
    ) -> List[ModelType]:
        """
        Get multiple records with pagination and filtering.

        Args:
            skip: Number of records to skip
            limit: Maximum number of records to return
            filters: Dictionary of field filters
            order_by: Field name to order by
            order_desc: Whether to order in descending order

        Returns:
            List of model instances
        """
        try:
            query = self.db.query(self.model)

            # Apply filters
            if filters:
                query = self._apply_filters(query, filters)

            # Apply ordering
            if order_by:
                if hasattr(self.model, order_by):
                    order_field = getattr(self.model, order_by)
                    if order_desc:
                        query = query.order_by(desc(order_field))
                    else:
                        query = query.order_by(asc(order_field))

            return query.offset(skip).limit(limit).all()
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e

    def create(self, obj_in: Dict[str, Any]) -> ModelType:
        """
        Create a new record.

        Args:
            obj_in: Dictionary of field values

        Returns:
            Created model instance
        """
        try:
            db_obj = self.model(**obj_in)
            self.db.add(db_obj)
            self.db.commit()
            self.db.refresh(db_obj)
            return db_obj
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e

    def update(self, id: int, obj_in: Dict[str, Any]) -> Optional[ModelType]:
        """
        Update an existing record.

        Args:
            id: Primary key value
            obj_in: Dictionary of field values to update

        Returns:
            Updated model instance or None if not found
        """
        try:
            db_obj = self.get(id)
            if not db_obj:
                return None

            # Update fields
            for field, value in obj_in.items():
                if hasattr(db_obj, field):
                    setattr(db_obj, field, value)

            self.db.commit()
            self.db.refresh(db_obj)
            return db_obj
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e

    def delete(self, id: int) -> bool:
        """
        Delete a record by ID.

        Args:
            id: Primary key value

        Returns:
            True if deleted, False if not found
        """
        try:
            db_obj = self.get(id)
            if not db_obj:
                return False

            self.db.delete(db_obj)
            self.db.commit()
            return True
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e

    def count(self, filters: Optional[Dict[str, Any]] = None) -> int:
        """
        Count records with optional filtering.

        Args:
            filters: Dictionary of field filters

        Returns:
            Number of matching records
        """
        try:
            query = self.db.query(func.count(self.model.id))

            if filters:
                query = self._apply_filters(query, filters)

            return query.scalar()
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e

    def exists(self, id: int) -> bool:
        """
        Check if a record exists by ID.

        Args:
            id: Primary key value

        Returns:
            True if exists, False otherwise
        """
        try:
            return (
                self.db.query(self.model.id).filter(self.model.id == id).first()
                is not None
            )
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e

    def bulk_create(self, objs_in: List[Dict[str, Any]]) -> List[ModelType]:
        """
        Create multiple records in a single transaction.

        Args:
            objs_in: List of dictionaries with field values

        Returns:
            List of created model instances
        """
        try:
            db_objs = [self.model(**obj_data) for obj_data in objs_in]
            self.db.add_all(db_objs)
            self.db.commit()

            # Refresh all objects to get generated IDs
            for db_obj in db_objs:
                self.db.refresh(db_obj)

            return db_objs
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e

    def bulk_update(self, updates: List[Dict[str, Any]]) -> int:
        """
        Update multiple records in a single transaction.

        Args:
            updates: List of dictionaries with 'id' and field values

        Returns:
            Number of updated records
        """
        try:
            updated_count = 0
            for update_data in updates:
                if "id" not in update_data:
                    continue

                obj_id = update_data.pop("id")
                result = (
                    self.db.query(self.model)
                    .filter(self.model.id == obj_id)
                    .update(update_data)
                )
                updated_count += result

            self.db.commit()
            return updated_count
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e

    def search(
        self,
        search_term: str,
        search_fields: List[str],
        skip: int = 0,
        limit: int = 100,
    ) -> List[ModelType]:
        """
        Full-text search across specified fields.

        Args:
            search_term: Term to search for
            search_fields: List of field names to search in
            skip: Number of records to skip
            limit: Maximum number of records to return

        Returns:
            List of matching model instances
        """
        try:
            query = self.db.query(self.model)

            # Build search conditions
            search_conditions = []
            for field_name in search_fields:
                if hasattr(self.model, field_name):
                    field = getattr(self.model, field_name)
                    search_conditions.append(field.ilike(f"%{search_term}%"))

            if search_conditions:
                query = query.filter(or_(*search_conditions))

            return query.offset(skip).limit(limit).all()
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e

    def _apply_filters(self, query: Query, filters: Dict[str, Any]) -> Query:
        """
        Apply filters to a query.

        Args:
            query: SQLAlchemy query object
            filters: Dictionary of field filters

        Returns:
            Filtered query object
        """
        for field_name, value in filters.items():
            if hasattr(self.model, field_name):
                field = getattr(self.model, field_name)

                if isinstance(value, dict):
                    # Handle complex filters like ranges, operators
                    for operator, filter_value in value.items():
                        if operator == "gt":
                            query = query.filter(field > filter_value)
                        elif operator == "gte":
                            query = query.filter(field >= filter_value)
                        elif operator == "lt":
                            query = query.filter(field < filter_value)
                        elif operator == "lte":
                            query = query.filter(field <= filter_value)
                        elif operator == "in":
                            query = query.filter(field.in_(filter_value))
                        elif operator == "not_in":
                            query = query.filter(~field.in_(filter_value))
                        elif operator == "like":
                            query = query.filter(
                                field.ilike(f"%{filter_value}%")
                            )
                        elif operator == "not_like":
                            query = query.filter(
                                ~field.ilike(f"%{filter_value}%")
                            )
                elif isinstance(value, list):
                    # Handle list of values (IN operator)
                    query = query.filter(field.in_(value))
                else:
                    # Handle simple equality
                    query = query.filter(field == value)

        return query

    @abstractmethod
    def get_by_unique_field(
        self, field_name: str, value: Any
    ) -> Optional[ModelType]:
        """
        Get a record by a unique field value.
        Must be implemented by concrete repositories.

        Args:
            field_name: Name of the unique field
            value: Value to search for

        Returns:
            Model instance or None if not found
        """
        pass


class RepositoryError(Exception):
    """Custom exception for repository operations."""

    pass


class ValidationError(RepositoryError):
    """Exception raised for data validation errors."""

    pass


class NotFoundError(RepositoryError):
    """Exception raised when a record is not found."""

    pass


class DuplicateError(RepositoryError):
    """Exception raised for duplicate record errors."""

    pass
