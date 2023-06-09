import {
  $,
  Resource,
  component$,
  useOnDocument,
  useResource$,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import { QwikLogo } from "../icons/qwik";
import styles from "./header.module.css";

export const TestComponent = component$(() => {
  const latestKey = useSignal("");

  useVisibleTask$(({ track }) => {
    // make sure the suggest dropdown closes when the search is submitted
    const k = track(() => latestKey.value);
    console.log("TestComponent::task::latestKey = ", k);
  });
  useOnDocument(
    "click",
    $((e) => {
      console.warn("TestComponent::click", e);
    })
  );
  useOnDocument(
    "keydown",
    $(async (event) => {
      const e = event as KeyboardEvent;
      console.warn("TestComponent::keydown", e);
      latestKey.value = e.code;
    })
  );

  const resource = useResource$<string | null>(async ({ track }) => {
    const value = track(() => latestKey.value);
    if (value) {
      // pause for 1 second
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const res = value.toUpperCase();
      console.log("TestComponent::useResource::value = ", res);
      if (res === "ESCAPE") {
        console.warn(
          "TestComponent::useResource:: returning an empty string to switch the condition inside the Resource render block, somehow this will cause the events to no longer register."
        );
        return "";
      }
      return res;
    }
    return null;
  });

  return (
    <>
      <Resource
        value={resource}
        onPending={() => <>Loading key ...</>}
        onResolved={(data) => (
          <>
            {data ? (
              <>
                <div>
                  <div>
                    <b>Latest Key: {latestKey.value}</b>
                  </div>
                  <div>
                    <b>Resource data: {data}</b>
                  </div>
                </div>
              </>
            ) : latestKey.value ? (
              <>Nothing, you pressed ESCAPE ... and the events no longer work</>
            ) : (
              <>Press any key</>
            )}
          </>
        )}
      />
    </>
  );
});

export const TestComponentWorking = component$(() => {
  const latestKey = useSignal("");

  useVisibleTask$(({ track }) => {
    // make sure the suggest dropdown closes when the search is submitted
    const k = track(() => latestKey.value);
    console.log("TestComponentWorking::task::latestKey = ", k);
  });
  useOnDocument(
    "click",
    $((e) => {
      console.warn("TestComponentWorking::click", e);
    })
  );
  useOnDocument(
    "keydown",
    $(async (event) => {
      const e = event as KeyboardEvent;
      console.warn("TestComponentWorking::keydown", e);
      latestKey.value = e.code;
    })
  );

  const resource = useResource$<string | null>(async ({ track }) => {
    const value = track(() => latestKey.value);
    if (value) {
      // pause for 1 second
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const res = value.toUpperCase();
      console.log("TestComponentWorking::useResource::value = ", res);
      if (res === "ESCAPE") {
        console.warn(
          "TestComponentWorking::useResource:: returning an empty string does not trigger any bug."
        );
        return "";
      }
      return res;
    }
    return null;
  });

  return (
    <div>
      <Resource
        value={resource}
        onPending={() => <>Loading key ...</>}
        onResolved={(data) => (
          <>
            {data ? (
              <>
                <div>
                  <div>
                    <b>Latest Key: {latestKey.value}</b>
                  </div>
                  <div>
                    <b>Resource data: {data}</b>
                  </div>
                </div>
              </>
            ) : latestKey.value ? (
              <>Nothing, you pressed ESCAPE ... and the events no longer work</>
            ) : (
              <>Press any key</>
            )}
          </>
        )}
      />
    </div>
  );
});

export default component$(() => {
  return (
    <header class={styles.header}>
      <div class={["container", styles.wrapper]}>
        <div class={styles.logo}>
          <a href="/" title="qwik">
            <QwikLogo height={50} width={143} />
          </a>
        </div>
      </div>
      <p>
        Here is a component that listens to Key events and clicks, see the Dev
        Console. Pressing ESC causes a bug and it no longer reacts to any click
        or key events.
      </p>
      <TestComponent />
      <p>Here is the same component but its JSX is wrapped in a DIV.</p>
      <TestComponentWorking />
    </header>
  );
});
