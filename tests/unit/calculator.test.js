const calculator = require("../../models/calculator");

test("sum function adds two numbers", () => {
  const result = calculator.somar(2, 2);
  expect(result).toBe(4);
});

test("sum function adds two numbers", () => {
  const result = calculator.somar(5, 100);
  expect(result).toBe(105);
});

test("sum 'banana' + 100 deveria retornar 'Error'", () => {
  const result = calculator.somar("banana", 100);
  expect(result).toBe("Error");
});
