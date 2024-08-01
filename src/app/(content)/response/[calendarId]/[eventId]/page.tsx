import React from "react";

const ResponsePage = ({
  params,
}: {
  params: { calendarId: string; eventId: string };
}) => {
  return (
    <div>
      <h1>Response</h1>
      <h2>Calendar ID: {params.calendarId}</h2>
      <h2>Event ID: {params.eventId}</h2>
    </div>
  );
};

export default ResponsePage;
