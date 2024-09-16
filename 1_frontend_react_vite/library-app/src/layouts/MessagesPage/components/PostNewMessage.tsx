import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import { Button } from "src/components/ui/button";
import { Card, CardContent } from "src/components/ui/card";
import MessageModel from "src/models/MessageModel";

export const PostNewMessage = () => {
  const { authState } = useOktaAuth();
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [displayWarning, setDisplayWarning] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);

  async function submitNewQuestion() {
    const url = `${import.meta.env.VITE_REACT_APP_API}/messages/secure/add/message`;
    if (authState?.isAuthenticated && title !== "" && question !== "") {
      const messageRequestModel: MessageModel = new MessageModel(
        title,
        question,
      );
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authState.accessToken?.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageRequestModel),
      };

      const submitNewQuestionResponse = await fetch(url, requestOptions);
      if (!submitNewQuestionResponse.ok) {
        throw new Error(
          `HTTP error! status: ${submitNewQuestionResponse.status}`,
        );
      }

      setTitle("");
      setQuestion("");
      setDisplayWarning(false);
      setDisplaySuccess(true);
    } else {
      setDisplayWarning(true);
      setDisplaySuccess(false);
    }
  }

  return (
    <div className="space-y-3">
      {displaySuccess && (
        <p className="rounded-sm border bg-green-200 px-2 py-1 text-xs text-green-700">
          Question added successfully
        </p>
      )}
      <Card className="flex flex-col space-y-3">
        <div className="bg-gray-200">
          <p className="p-2 text-center text-sm font-bold">
            Ask question to Luv 2 Read Admin
          </p>
        </div>
        <CardContent>
          <form method="POST" className="flex flex-col space-y-3">
            {displayWarning && (
              <p className="rounded-sm border bg-red-200 px-2 py-1 text-xs text-red-700">
                All fields must be filled out
              </p>
            )}
            <div className="flex flex-col space-y-3">
              <label className="text-sm">Title</label>
              <input
                type="text"
                placeholder="title"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                className="border p-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-cyan-600"
              />
            </div>
            <div className="flex flex-col space-y-3">
              <label className="text-sm">Question</label>
              <textarea
                rows={3}
                onChange={(e) => setQuestion(e.target.value)}
                value={question}
                className="border p-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-cyan-600"
              ></textarea>
            </div>
            <div>
              <Button
                variant="outline"
                onClick={submitNewQuestion}
                type="button"
              >
                Submit Quesiton
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
