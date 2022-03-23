export function Typography({ size = '15px', color = '#000', children }) {
    const style = {
        fontSize: size,
        color
    }

    return <p style={style}>{children}</p>
}
