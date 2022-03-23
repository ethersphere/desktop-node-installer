export function Circle({ color, size, borderSize, borderColor, quarter = false, spinner = false }) {
    const style = {
        background: color,
        width: size,
        height: size,
        border: `${borderSize} solid ${borderColor}`,
        borderRadius: '9999px',
        borderLeftColor: quarter ? 'transparent' : borderColor,
        borderBottomColor: quarter ? 'transparent' : borderColor,
        borderRightColor: quarter ? 'transparent' : borderColor
    }
    return <div className={spinner ? 'spinner' : ''} style={style}></div>
}
