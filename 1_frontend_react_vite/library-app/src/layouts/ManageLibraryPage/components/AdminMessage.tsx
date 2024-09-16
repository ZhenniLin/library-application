import { useState } from "react";
import { Button } from "src/components/ui/button";
import { Card } from "src/components/ui/card";
import MessageModel from "src/models/MessageModel";

export const AdminMessage: React.FC<{
  message: MessageModel;
  submitResponseToQuestion: any;
}> = (props, key) => {
  const [displayWarning, setDisplayWarning] = useState(false);
  const [response, setResponse] = useState("");

  function submitBtn() {
    if (props.message.id !== null && response !== "") {
      props.submitResponseToQuestion(props.message.id, response);
      setDisplayWarning(false);
    } else {
      setDisplayWarning(true);
    }
  }

  return (
    <div key={props.message.id} className="mb-5">
      <Card className="p-3 shadow-md">
        <p className="font-bold">
          Case #{props.message.id}: {props.message.title}
        </p>
        <p className="text-sm">{props.message.userEmail}</p>
        <p className="mb-3 mt-2">{props.message.question}</p>
        <hr />
        <div className="mt-3 flex flex-col space-y-2">
          <p className="font-bold">Response:</p>
          <form action="PUT" className="flex flex-col space-y-4">
            {displayWarning && (
              <div className="rounded-md bg-red-200 px-2 py-1 text-sm text-red-600">
                All fileds must be filled out.
              </div>
            )}
            <div className="flex flex-col space-y-2 text-sm">
              <label>Description</label>
              <textarea
                id="exampleFormControlTestarea1"
                rows={3}
                onChange={(e) => setResponse(e.target.value)}
                value={response}
                className="rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              ></textarea>
            </div>
            <div>
              <Button variant="outline" onClick={submitBtn} type="button">
                Submit Response
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};
