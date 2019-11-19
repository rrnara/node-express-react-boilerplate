import React from 'react';

export default function MultilineString(str = "", keyPrefix = 'str') {
  const splits = str.split("\n");
  return (
    <span>
      {
        splits.map((spl, i) => {
          if (i == 0) {
            return <span key={`${keyPrefix}_${i}`}>{spl}</span>;
          }
          return <span key={`${keyPrefix}_${i}`}><br />{spl}</span>;
        })
      }
    </span>
  )
}
