from typing import Any, Dict, List, Optional


def extract_numeric_value(
    data: Dict[str, Any], possible_keys: List[str]
) -> Optional[float]:
    """Safely extract a numeric value from data using possible key names.

    Handles both exact and case-insensitive matches and cleans common
    formatting characters before conversion.
    """
    for key in possible_keys:
        # Try exact match first
        if key in data:
            value = data[key]
            if isinstance(value, (int, float)):
                return float(value)
            if isinstance(value, str):
                try:
                    return float(
                        value.replace(",", "")
                        .replace("$", "")
                        .replace("(", "-")
                        .replace(")", "")
                    )
                except (ValueError, TypeError):
                    continue

        # Case-insensitive search
        for data_key, value in data.items():
            if data_key.lower() == key.lower():
                if isinstance(value, (int, float)):
                    return float(value)
                if isinstance(value, str):
                    try:
                        return float(
                            value.replace(",", "")
                            .replace("$", "")
                            .replace("(", "-")
                            .replace(")", "")
                        )
                    except (ValueError, TypeError):
                        continue

    return None
