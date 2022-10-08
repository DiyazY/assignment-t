import { render, screen } from "@testing-library/react";
import GroupHeader from ".";

describe("testing entry's header", () => {
  const text = "the most important"
  test("it should show 50/100 ration and bg color should be 'success'", () => {
    render(
      <GroupHeader threshold={100} current={50} text={text} />
    );
    expect(screen.getByText(text)).toBeInTheDocument()
    expect(screen.getByText('50/100')).toBeInTheDocument()
    expect(screen.getByTestId('linear-progress')).toHaveStyle(`background-color: rgb(175, 205, 177)`)
  });

  test("it should show 80/100 ration and bg color should be 'warning'", () => {
    render(
      <GroupHeader threshold={100} current={80} text={text} />
    );
    expect(screen.getByText(text)).toBeInTheDocument()
    expect(screen.getByText('80/100')).toBeInTheDocument()
    expect(screen.getByTestId('linear-progress')).toHaveStyle(`background-color: rgb(248, 199, 158)`)
  });

  test("it should show 100/100 ration and bg color should be 'error'", () => {
    render(
      <GroupHeader threshold={100} current={100} text={text} />
    );
    expect(screen.getByText(text)).toBeInTheDocument()
    expect(screen.getByText('100/100')).toBeInTheDocument()
    expect(screen.getByTestId('linear-progress')).toHaveStyle(`background-color: rgb(238, 175, 175)`)
  });
});
