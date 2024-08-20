import React, { useState } from 'react';

type InputProps = {
    onUpdate: (val: string) => void;
}

function ControlledInput({ onUpdate }: InputProps): JSX.Element {
    const [value, setValue] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        onUpdate(newValue); // Notify parent of the change
    };

    return <input value={value} onChange={handleChange} type="text" placeholder="Enter last name" />;
}

export default ControlledInput;
