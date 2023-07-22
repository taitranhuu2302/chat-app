import React from 'react';
import { getTrackBackground, Range } from 'react-range';

interface IProps {
  values?: number[];
  setValues?: (values: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
}

const Slider: React.FC<IProps> = ({
  values = [50],
  setValues,
  min = 0,
  max = 100,
  step = 1,
}) => {
  return (
    <>
      <Range
        step={step}
        min={min}
        max={max}
        values={values}
        onChange={(values) => setValues && setValues(values)}
        renderTrack={({ props, children }) => (
          <div
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            style={{
              ...props.style,
              height: '5px',
              display: 'flex',
              width: '100%',
            }}>
            <div
              ref={props.ref}
              style={{
                height: '4px',
                width: '100%',
                borderRadius: '4px',
                background: getTrackBackground({
                  values: values,
                  colors: ['#ffffff', '#595460'],
                  min: min,
                  max: max,
                }),
                alignSelf: 'center',
              }}>
              {children}
            </div>
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '42px',
              width: '42px',
              backgroundColor: '#999',
              display: 'none',
            }}
          />
        )}
      />
    </>
  );
};

export default Slider;