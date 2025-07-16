// currency, decimal, percent, unit

export function formatNumber(value: number | string, style: Intl.NumberFormatOptionsStyle) {
    const format: Intl.NumberFormatOptions = { style: style }
    value = Number(value)

    if (style == "decimal") {
        format.maximumFractionDigits = 2;
    }

    if (style == "percent") {
        format.maximumFractionDigits = 2;
        value = value / 100
    }

    if (style == "currency") {
        format.currency = "INR";
        format.maximumFractionDigits = 0;
    }

    const formattedValue = new Intl.NumberFormat("en-US", format).format(value);
    return formattedValue;
}