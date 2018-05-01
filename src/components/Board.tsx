import { observer } from "mobx-react";
import * as React from "react";

export interface BoardProps {
}

@observer
export default class Board extends React.Component<BoardProps, {}> {
  render() {
    return (
      <table className="ban">
        <tbody>
          <tr></tr>
        </tbody>
      </table>
    );
  }
}
