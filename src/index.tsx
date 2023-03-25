import { Form, ActionPanel, Action, showToast, useNavigation, Detail, Clipboard } from "@raycast/api";

import { useAPIKEY } from "./hooks/useAPIKEY";
import { PROFESSIONAL_REPHRASE } from "./constants/prompts";
import chat from "./utils/chat";
import { useState } from "react";

function Result({ message }: { message: string }) {
  const { key } = useAPIKEY();
  const [responseMessage, setResponseMessage] = useState<string>(() => message);

  async function handleOnAction({ less = true }: { less: boolean }) {
    showToast({ title: "Submitted", message: `Asking to be ${less ? "less" : "more"} formal` });
    const { message: responseMsg, error } = await chat({
      apiKey: key,
      systemMessage: "",
      message: `Make me sound ${less ? "less" : "more"} formal: ${responseMessage}`,
    });
    if (error !== null) {
      showToast({ title: "Error", message: "Something went wrong!" });
      return;
    }
    setResponseMessage(responseMsg || "");
  }

  return (
    <Detail
      markdown={responseMessage}
      actions={
        <ActionPanel>
          <Action
            title="Insert"
            onAction={async () => {
              await Clipboard.paste(responseMessage);
              showToast({ title: "Text inserted" });
            }}
          />
          <Action
            title="Copy"
            onAction={async () => {
              await Clipboard.copy(responseMessage);
              showToast({ title: "Copied to your clipboard" });
            }}
          />
          <Action
            title="Less Formal"
            onAction={async () => {
              await handleOnAction({ less: true });
            }}
          />
          <Action
            title="More Formal"
            onAction={async () => {
              await handleOnAction({ less: false });
            }}
          />
        </ActionPanel>
      }
    />
  );
}

type Values = {
  sentences: string;
};

export default function Command() {
  const { key } = useAPIKEY();
  const { push } = useNavigation();
  const [input, setInput] = useState<string>("");

  async function handleSubmit(values: Values): Promise<void> {
    showToast({ title: "Submitted", message: "Message processing" });
    const { message, error } = await chat({
      apiKey: key,
      systemMessage: PROFESSIONAL_REPHRASE.system,
      message: values.sentences,
    });
    if (error !== null) {
      showToast({ title: "Error", message: "Something went wrong!" });
      return;
    }
    push(<Result message={message || "No result"} />);
  }
  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
          <Action title="Clear" onAction={() => setInput("")} />
        </ActionPanel>
      }
    >
      <Form.Description text={PROFESSIONAL_REPHRASE.description} />
      <Form.TextArea
        id="sentences"
        title=""
        placeholder="Enter your sentences here"
        value={input}
        onChange={setInput}
      />
    </Form>
  );
}
