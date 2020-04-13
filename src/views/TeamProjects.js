import React from 'react';
export default function TeamProjects(props) {
  return (<>
        <div className="teams-list">
            <p></p>{props.match.params.teamId}
          </div>
  </>
  );
}