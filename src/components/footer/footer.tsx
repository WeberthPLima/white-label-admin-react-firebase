import { useState } from "react";

interface Props {
  title: string,
} 

export default function FooterComponent(props: Props) {
  const [data, setData] = useState();
  
  return <h1>{props.title}</h1>;
}
