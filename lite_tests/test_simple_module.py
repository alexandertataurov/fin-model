from app.simple_module import add, subtract, divide
import pytest

def test_add_subtract():
    assert add(2, 3) == 5
    assert subtract(5, 3) == 2

def test_divide_normal():
    assert divide(10, 2) == 5


def test_divide_by_zero():
    with pytest.raises(ValueError):
        divide(1, 0)
