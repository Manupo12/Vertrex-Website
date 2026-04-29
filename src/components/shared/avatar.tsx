"use client";
import { FC } from 'react';

const Avatar: FC<{ name?: string }> = ({ name }) => {
  return (
    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#eef2ff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      {name ? name.charAt(0).toUpperCase() : '?'}
    </div>
  );
};

export default Avatar;
