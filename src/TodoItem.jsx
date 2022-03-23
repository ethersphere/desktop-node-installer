import { Circle } from './Circle'
import { Typography } from './Typography'

export function TodoItem({ data = null, active = false, done = false, children }) {
    return (
        <div className="todo-item">
            <div className="todo-body">
                {active && (
                    <Circle size={24} color="transparent" borderSize="2px" borderColor="#0000ff" spinner quarter />
                )}
                {done && <Circle size={24} color="rgb(102 224 102)" border="0" />}
                {!done && !active && <Circle size={24} color="transparent" borderSize="2px" borderColor="#cccccc" />}
                <Typography color={active ? '#000' : done ? '#444' : '#888'}>{children}</Typography>
            </div>
            {data && <code>{data}</code>}
        </div>
    )
}
