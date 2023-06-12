import {
  $,
  component$,
  useOnDocument,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import { QwikLogo } from "../icons/qwik";
import styles from "./header.module.css";

export const TestComponent = component$(() => {
  const latestKey = useSignal("");
  const keyCount = useSignal(0);
  const clickCount = useSignal(0);

  useVisibleTask$(({ track }) => {
    const k = track(() => latestKey.value);
    console.log("TestComponent::task::latestKey = ", k);
  });
  useOnDocument(
    "click",
    $((e) => {
      clickCount.value++;
      console.warn("TestComponent::click", e);
    })
  );
  useOnDocument(
    "keydown",
    $(async (event) => {
      keyCount.value++;
      const e = event as KeyboardEvent;
      console.warn("TestComponent::keydown", e);
      latestKey.value = e.code;
    })
  );

  return (
    <>
      {latestKey.value && latestKey.value != "Escape" ? (
        <>
          <div>
            <div>
              <b>Latest Key: {latestKey.value}</b>
            </div>
            <div>
              <b>Click count: {clickCount.value}</b>
            </div>
            <div>
              <b>Key count: {keyCount.value}</b>
            </div>
          </div>
        </>
      ) : latestKey.value ? (
        <>
          Nothing, you pressed ESCAPE ... and the events no longer work. Click
          Count {clickCount.value} Key Count {keyCount.value}
        </>
      ) : (
        <>Press any key</>
      )}
    </>
  );
});

export const TestComponentWrapped = component$(() => {
  const latestKey = useSignal("");
  const keyCount = useSignal(0);
  const clickCount = useSignal(0);

  useVisibleTask$(({ track }) => {
    const k = track(() => latestKey.value);
    console.log("TestComponentWrapped::task::latestKey = ", k);
  });
  useOnDocument(
    "click",
    $((e) => {
      clickCount.value++;
      console.warn("TestComponentWrapped::click", e);
    })
  );
  useOnDocument(
    "keydown",
    $(async (event) => {
      keyCount.value++;
      const e = event as KeyboardEvent;
      console.warn("TestComponentWrapped::keydown", e);
      latestKey.value = e.code;
    })
  );

  return (
    <div>
      {latestKey.value && latestKey.value != "Escape" ? (
        <>
          <div>
            <div>
              <b>Latest Key: {latestKey.value}</b>
            </div>
            <div>
              <b>Click count: {clickCount.value}</b>
            </div>
            <div>
              <b>Key count: {keyCount.value}</b>
            </div>
          </div>
        </>
      ) : latestKey.value ? (
        <>
          Nothing, you pressed ESCAPE ... and the events no longer work. Click
          Count {clickCount.value} Key Count {keyCount.value}
        </>
      ) : (
        <>Press any key</>
      )}
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
      <p>
        Here is the same component but its JSX is wrapped in a DIV, now events
        are listened to *twice*. This is also visible in the Inspector as both
        the wrapping DIV and the DIV inside it have the event handlers. After
        pressing ESC the second DIV is removed so events are counted only once
        correctly.
      </p>
      <TestComponentWrapped />
    </header>
  );
});
