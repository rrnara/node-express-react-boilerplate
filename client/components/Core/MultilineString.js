export default function MultilineString(str = "") {
  const splits = str.split("\n");
  return (
    <span>
      {
        splits.map((spl, i) => {
          if (i == 0) {
            return <span>{spl}</span>;
          }
          return <span><br />{spl}</span>;
        })
      }
    </span>
  )
}
