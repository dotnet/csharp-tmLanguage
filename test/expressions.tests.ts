/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from "chai";
import { tokenize, Input, Token } from "./utils/tokenize";

describe("Expressions", () => {
  before(() => {
    should();
  });

  describe("Expressions", () => {
    describe("Object creation", () => {
      it("with argument multiplication (issue #82)", async () => {
        const input = Input.InMethod(
          `var newPoint = new Vector(point.x * z, 0);`
        );
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("newPoint"),
          Token.Operator.Assignment,
          Token.Operator.Expression.New,
          Token.Type("Vector"),
          Token.Punctuation.OpenParen,
          Token.Variable.Object("point"),
          Token.Punctuation.Accessor,
          Token.Variable.Property("x"),
          Token.Operator.Arithmetic.Multiplication,
          Token.Variable.ReadWrite("z"),
          Token.Punctuation.Comma,
          Token.Literal.Numeric.Decimal("0"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("with stackalloc keyword and byte array", async () => {
        const input = Input.InMethod(`var bytes = stackalloc byte[10];`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("bytes"),
          Token.Operator.Assignment,
          Token.Operator.Expression.StackAlloc,
          Token.PrimitiveType.Byte,
          Token.Punctuation.OpenBracket,
          Token.Literal.Numeric.Decimal("10"),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Semicolon
        ]);
      });

      it("with stackalloc keyword and int array", async () => {
        const input = Input.InMethod(`var ints = stackalloc int[42];`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("ints"),
          Token.Operator.Assignment,
          Token.Operator.Expression.StackAlloc,
          Token.PrimitiveType.Int,
          Token.Punctuation.OpenBracket,
          Token.Literal.Numeric.Decimal("42"),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Semicolon
        ]);
      });

      it("with stackalloc keyword in a nested expression (C# 8)", async () => {
        const input = Input.InMethod(`Foo(stackalloc[] { 1, 3 });`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("Foo"),
          Token.Punctuation.OpenParen,
          Token.Operator.Expression.StackAlloc,
          Token.Punctuation.OpenBracket,
          Token.Punctuation.CloseBracket,
          Token.Punctuation.OpenBrace,
          Token.Literal.Numeric.Decimal("1"),
          Token.Punctuation.Comma,
          Token.Literal.Numeric.Decimal("3"),
          Token.Punctuation.CloseBrace,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("comment before initializer (issue #264)", async () => {
        const input = Input.InMethod(`
var a = new A // comment
{
  X = 1
};`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("a"),
          Token.Operator.Assignment,
          Token.Operator.Expression.New,
          Token.Type("A"),
          Token.Comment.SingleLine.Start,
          Token.Comment.SingleLine.Text(" comment"),
          Token.Punctuation.OpenBrace,
          Token.Variable.ReadWrite("X"),
          Token.Operator.Assignment,
          Token.Literal.Numeric.Decimal("1"),
          Token.Punctuation.CloseBrace,
          Token.Punctuation.Semicolon,
        ]);
      });
    });

    describe("Anonymous Methods", () => {
      it("lambda expression with no parameters (assignment)", async () => {
        const input = Input.InMethod(`Action a = () => { };`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Type("Action"),
          Token.Identifier.LocalName("a"),
          Token.Operator.Assignment,
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Operator.Arrow,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.Semicolon
        ]);
      });

      it("lambda expression with single parameter (assignment)", async () => {
        const input = Input.InMethod(`Action<int> a = x => { };`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Type("Action"),
          Token.Punctuation.TypeParameter.Begin,
          Token.PrimitiveType.Int,
          Token.Punctuation.TypeParameter.End,
          Token.Identifier.LocalName("a"),
          Token.Operator.Assignment,
          Token.Identifier.ParameterName("x"),
          Token.Operator.Arrow,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.Semicolon
        ]);
      });

      it("lambda expression with single parenthesized parameter (assignment)", async () => {
        const input = Input.InMethod(`Action<int> a = (x) => { };`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Type("Action"),
          Token.Punctuation.TypeParameter.Begin,
          Token.PrimitiveType.Int,
          Token.Punctuation.TypeParameter.End,
          Token.Identifier.LocalName("a"),
          Token.Operator.Assignment,
          Token.Punctuation.OpenParen,
          Token.Identifier.ParameterName("x"),
          Token.Punctuation.CloseParen,
          Token.Operator.Arrow,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.Semicolon
        ]);
      });

      it("lambda expression with single typed parameter (assignment)", async () => {
        const input = Input.InMethod(`Action<int> a = (int x) => { };`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Type("Action"),
          Token.Punctuation.TypeParameter.Begin,
          Token.PrimitiveType.Int,
          Token.Punctuation.TypeParameter.End,
          Token.Identifier.LocalName("a"),
          Token.Operator.Assignment,
          Token.Punctuation.OpenParen,
          Token.PrimitiveType.Int,
          Token.Identifier.ParameterName("x"),
          Token.Punctuation.CloseParen,
          Token.Operator.Arrow,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.Semicolon
        ]);
      });

      it("lambda expression with multiple parameters (assignment)", async () => {
        const input = Input.InMethod(`Action<int, int> a = (x, y) => { };`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Type("Action"),
          Token.Punctuation.TypeParameter.Begin,
          Token.PrimitiveType.Int,
          Token.Punctuation.Comma,
          Token.PrimitiveType.Int,
          Token.Punctuation.TypeParameter.End,
          Token.Identifier.LocalName("a"),
          Token.Operator.Assignment,
          Token.Punctuation.OpenParen,
          Token.Identifier.ParameterName("x"),
          Token.Punctuation.Comma,
          Token.Identifier.ParameterName("y"),
          Token.Punctuation.CloseParen,
          Token.Operator.Arrow,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.Semicolon
        ]);
      });

      it("lambda expression with multiple parameters with long names (assignment)", async () => {
        const input = Input.InMethod(
          `Action<int, int> a = (parameterNo1, parameterNo2) => { };`
        );
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Type("Action"),
          Token.Punctuation.TypeParameter.Begin,
          Token.PrimitiveType.Int,
          Token.Punctuation.Comma,
          Token.PrimitiveType.Int,
          Token.Punctuation.TypeParameter.End,
          Token.Identifier.LocalName("a"),
          Token.Operator.Assignment,
          Token.Punctuation.OpenParen,
          Token.Identifier.ParameterName("parameterNo1"),
          Token.Punctuation.Comma,
          Token.Identifier.ParameterName("parameterNo2"),
          Token.Punctuation.CloseParen,
          Token.Operator.Arrow,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.Semicolon
        ]);
      });

      it("lambda expression with multiple typed parameters (assignment)", async () => {
        const input = Input.InMethod(
          `Action<int, int> a = (int x, int y) => { };`
        );
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Type("Action"),
          Token.Punctuation.TypeParameter.Begin,
          Token.PrimitiveType.Int,
          Token.Punctuation.Comma,
          Token.PrimitiveType.Int,
          Token.Punctuation.TypeParameter.End,
          Token.Identifier.LocalName("a"),
          Token.Operator.Assignment,
          Token.Punctuation.OpenParen,
          Token.PrimitiveType.Int,
          Token.Identifier.ParameterName("x"),
          Token.Punctuation.Comma,
          Token.PrimitiveType.Int,
          Token.Identifier.ParameterName("y"),
          Token.Punctuation.CloseParen,
          Token.Operator.Arrow,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.Semicolon
        ]);
      });

      it("async lambda expression with no parameters (assignment)", async () => {
        const input = Input.InMethod(`Func<Task> a = async () => { };`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Type("Func"),
          Token.Punctuation.TypeParameter.Begin,
          Token.Type("Task"),
          Token.Punctuation.TypeParameter.End,
          Token.Identifier.LocalName("a"),
          Token.Operator.Assignment,
          Token.Keyword.Modifier.Async,
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Operator.Arrow,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.Semicolon
        ]);
      });

      it("async lambda expression with single parameter (assignment)", async () => {
        const input = Input.InMethod(`Func<int, Task> a = async x => { };`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Type("Func"),
          Token.Punctuation.TypeParameter.Begin,
          Token.PrimitiveType.Int,
          Token.Punctuation.Comma,
          Token.Type("Task"),
          Token.Punctuation.TypeParameter.End,
          Token.Identifier.LocalName("a"),
          Token.Operator.Assignment,
          Token.Keyword.Modifier.Async,
          Token.Identifier.ParameterName("x"),
          Token.Operator.Arrow,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.Semicolon
        ]);
      });

      it("async lambda expression with single parenthesized parameter (assignment)", async () => {
        const input = Input.InMethod(`Func<int, Task> a = async (x) => { };`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Type("Func"),
          Token.Punctuation.TypeParameter.Begin,
          Token.PrimitiveType.Int,
          Token.Punctuation.Comma,
          Token.Type("Task"),
          Token.Punctuation.TypeParameter.End,
          Token.Identifier.LocalName("a"),
          Token.Operator.Assignment,
          Token.Keyword.Modifier.Async,
          Token.Punctuation.OpenParen,
          Token.Identifier.ParameterName("x"),
          Token.Punctuation.CloseParen,
          Token.Operator.Arrow,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.Semicolon
        ]);
      });

      it("async lambda expression with single typed parameter (assignment)", async () => {
        const input = Input.InMethod(
          `Func<int, Task> a = async (int x) => { };`
        );
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Type("Func"),
          Token.Punctuation.TypeParameter.Begin,
          Token.PrimitiveType.Int,
          Token.Punctuation.Comma,
          Token.Type("Task"),
          Token.Punctuation.TypeParameter.End,
          Token.Identifier.LocalName("a"),
          Token.Operator.Assignment,
          Token.Keyword.Modifier.Async,
          Token.Punctuation.OpenParen,
          Token.PrimitiveType.Int,
          Token.Identifier.ParameterName("x"),
          Token.Punctuation.CloseParen,
          Token.Operator.Arrow,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.Semicolon
        ]);
      });

      it("async lambda expression with multiple typed parameters (assignment)", async () => {
        const input = Input.InMethod(
          `Func<int, int, Task> a = async (int x, int y) => { };`
        );
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Type("Func"),
          Token.Punctuation.TypeParameter.Begin,
          Token.PrimitiveType.Int,
          Token.Punctuation.Comma,
          Token.PrimitiveType.Int,
          Token.Punctuation.Comma,
          Token.Type("Task"),
          Token.Punctuation.TypeParameter.End,
          Token.Identifier.LocalName("a"),
          Token.Operator.Assignment,
          Token.Keyword.Modifier.Async,
          Token.Punctuation.OpenParen,
          Token.PrimitiveType.Int,
          Token.Identifier.ParameterName("x"),
          Token.Punctuation.Comma,
          Token.PrimitiveType.Int,
          Token.Identifier.ParameterName("y"),
          Token.Punctuation.CloseParen,
          Token.Operator.Arrow,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.Semicolon
        ]);
      });

      it("async lambda expression with multiple parameters (assignment)", async () => {
        const input = Input.InMethod(
          `Func<int, int, Task> a = async (x, y) => { };`
        );
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Type("Func"),
          Token.Punctuation.TypeParameter.Begin,
          Token.PrimitiveType.Int,
          Token.Punctuation.Comma,
          Token.PrimitiveType.Int,
          Token.Punctuation.Comma,
          Token.Type("Task"),
          Token.Punctuation.TypeParameter.End,
          Token.Identifier.LocalName("a"),
          Token.Operator.Assignment,
          Token.Keyword.Modifier.Async,
          Token.Punctuation.OpenParen,
          Token.Identifier.ParameterName("x"),
          Token.Punctuation.Comma,
          Token.Identifier.ParameterName("y"),
          Token.Punctuation.CloseParen,
          Token.Operator.Arrow,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.Semicolon
        ]);
      });

      it("async lambda assigned to dotted name (issue #142)", async () => {
        const input = Input.InMethod(
          `Something.listener = async args => { return true; };`
        );
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Variable.Object("Something"),
          Token.Punctuation.Accessor,
          Token.Variable.Property("listener"),
          Token.Operator.Assignment,
          Token.Keyword.Modifier.Async,
          Token.Identifier.ParameterName("args"),
          Token.Operator.Arrow,
          Token.Punctuation.OpenBrace,
          Token.Keyword.Flow.Return,
          Token.Literal.Boolean.True,
          Token.Punctuation.Semicolon,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.Semicolon
        ]);
      });

      it("anonymous method with no parameter list (assignment)", async () => {
        const input = Input.InMethod(`Action a = delegate { };`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Type("Action"),
          Token.Identifier.LocalName("a"),
          Token.Operator.Assignment,
          Token.Keyword.Definition.Delegate,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.Semicolon
        ]);
      });

      it("anonymous method with empty parameter list (assignment)", async () => {
        const input = Input.InMethod(`Action a = delegate() { };`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Type("Action"),
          Token.Identifier.LocalName("a"),
          Token.Operator.Assignment,
          Token.Keyword.Definition.Delegate,
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.Semicolon
        ]);
      });

      it("anonymous method with parameters (assignment)", async () => {
        const input = Input.InMethod(`Action a = delegate(int x, int y) { };`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Type("Action"),
          Token.Identifier.LocalName("a"),
          Token.Operator.Assignment,
          Token.Keyword.Definition.Delegate,
          Token.Punctuation.OpenParen,
          Token.PrimitiveType.Int,
          Token.Identifier.ParameterName("x"),
          Token.Punctuation.Comma,
          Token.PrimitiveType.Int,
          Token.Identifier.ParameterName("y"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.Semicolon
        ]);
      });

      it("async anonymous method with no parameter list (assignment)", async () => {
        const input = Input.InMethod(`Func<Task> a = async delegate { };`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Type("Func"),
          Token.Punctuation.TypeParameter.Begin,
          Token.Type("Task"),
          Token.Punctuation.TypeParameter.End,
          Token.Identifier.LocalName("a"),
          Token.Operator.Assignment,
          Token.Keyword.Modifier.Async,
          Token.Keyword.Definition.Delegate,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.Semicolon
        ]);
      });

      it("async anonymous method with empty parameter list (assignment)", async () => {
        const input = Input.InMethod(`Func<Task> a = async delegate() { };`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Type("Func"),
          Token.Punctuation.TypeParameter.Begin,
          Token.Type("Task"),
          Token.Punctuation.TypeParameter.End,
          Token.Identifier.LocalName("a"),
          Token.Operator.Assignment,
          Token.Keyword.Modifier.Async,
          Token.Keyword.Definition.Delegate,
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.Semicolon
        ]);
      });

      it("async anonymous method with parameters (assignment)", async () => {
        const input = Input.InMethod(
          `Func<Task> a = async delegate(int x, int y) { };`
        );
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Type("Func"),
          Token.Punctuation.TypeParameter.Begin,
          Token.Type("Task"),
          Token.Punctuation.TypeParameter.End,
          Token.Identifier.LocalName("a"),
          Token.Operator.Assignment,
          Token.Keyword.Modifier.Async,
          Token.Keyword.Definition.Delegate,
          Token.Punctuation.OpenParen,
          Token.PrimitiveType.Int,
          Token.Identifier.ParameterName("x"),
          Token.Punctuation.Comma,
          Token.PrimitiveType.Int,
          Token.Identifier.ParameterName("y"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.Semicolon
        ]);
      });

      it("lambda expression with no parameters (passed as argument)", async () => {
        const input = Input.InMethod(`M(() => { });`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Operator.Arrow,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("lambda expression with single parameter (passed as argument)", async () => {
        const input = Input.InMethod(`M(x => { });`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Identifier.ParameterName("x"),
          Token.Operator.Arrow,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("lambda expression with single parenthesized parameter (passed as argument)", async () => {
        const input = Input.InMethod(`M((x) => { });`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.OpenParen,
          Token.Identifier.ParameterName("x"),
          Token.Punctuation.CloseParen,
          Token.Operator.Arrow,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("lambda expression with single typed parameter (passed as argument)", async () => {
        const input = Input.InMethod(`M((int x) => { });`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.OpenParen,
          Token.PrimitiveType.Int,
          Token.Identifier.ParameterName("x"),
          Token.Punctuation.CloseParen,
          Token.Operator.Arrow,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("lambda expression with multiple parameters (passed as argument)", async () => {
        const input = Input.InMethod(`M((x, y) => { });`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.OpenParen,
          Token.Identifier.ParameterName("x"),
          Token.Punctuation.Comma,
          Token.Identifier.ParameterName("y"),
          Token.Punctuation.CloseParen,
          Token.Operator.Arrow,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("lambda expression with multiple typed parameters (passed as argument)", async () => {
        const input = Input.InMethod(`M((int x, int y) => { });`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.OpenParen,
          Token.PrimitiveType.Int,
          Token.Identifier.ParameterName("x"),
          Token.Punctuation.Comma,
          Token.PrimitiveType.Int,
          Token.Identifier.ParameterName("y"),
          Token.Punctuation.CloseParen,
          Token.Operator.Arrow,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("async lambda expression with no parameters (passed as argument)", async () => {
        const input = Input.InMethod(`M(async () => { });`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Keyword.Modifier.Async,
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Operator.Arrow,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("async lambda expression with single parameter (passed as argument)", async () => {
        const input = Input.InMethod(`M(async x => { });`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Keyword.Modifier.Async,
          Token.Identifier.ParameterName("x"),
          Token.Operator.Arrow,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("async lambda expression with single parenthesized parameter (passed as argument)", async () => {
        const input = Input.InMethod(`M(async (x) => { });`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Keyword.Modifier.Async,
          Token.Punctuation.OpenParen,
          Token.Identifier.ParameterName("x"),
          Token.Punctuation.CloseParen,
          Token.Operator.Arrow,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("async lambda expression with single typed parameter (passed as argument)", async () => {
        const input = Input.InMethod(`M(async (int x) => { });`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Keyword.Modifier.Async,
          Token.Punctuation.OpenParen,
          Token.PrimitiveType.Int,
          Token.Identifier.ParameterName("x"),
          Token.Punctuation.CloseParen,
          Token.Operator.Arrow,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("async lambda expression with multiple parameters (passed as argument)", async () => {
        const input = Input.InMethod(`M(async (x, y) => { });`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Keyword.Modifier.Async,
          Token.Punctuation.OpenParen,
          Token.Identifier.ParameterName("x"),
          Token.Punctuation.Comma,
          Token.Identifier.ParameterName("y"),
          Token.Punctuation.CloseParen,
          Token.Operator.Arrow,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("async lambda expression with multiple typed parameters (passed as argument)", async () => {
        const input = Input.InMethod(`M(async (int x, int y) => { });`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Keyword.Modifier.Async,
          Token.Punctuation.OpenParen,
          Token.PrimitiveType.Int,
          Token.Identifier.ParameterName("x"),
          Token.Punctuation.Comma,
          Token.PrimitiveType.Int,
          Token.Identifier.ParameterName("y"),
          Token.Punctuation.CloseParen,
          Token.Operator.Arrow,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("lambda expression with ref return", async () => {
        const input = Input.InMethod(`M((ref int x) => ref x);`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.OpenParen,
          Token.Keyword.Modifier.Ref,
          Token.PrimitiveType.Int,
          Token.Identifier.ParameterName("x"),
          Token.Punctuation.CloseParen,
          Token.Operator.Arrow,
          Token.Keyword.Modifier.Ref,
          Token.Variable.ReadWrite("x"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("lambda expression with in parameter - in int", async () => {
        const input = Input.InMethod(`M((in int x) => x);`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.OpenParen,
          Token.Keyword.Modifier.In,
          Token.PrimitiveType.Int,
          Token.Identifier.ParameterName("x"),
          Token.Punctuation.CloseParen,
          Token.Operator.Arrow,
          Token.Variable.ReadWrite("x"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("anonymous method with no parameter list (passed as argument)", async () => {
        const input = Input.InMethod(`M(delegate { });`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Keyword.Definition.Delegate,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("anonymous method with empty parameter list (passed as argument)", async () => {
        const input = Input.InMethod(`M(delegate() { });`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Keyword.Definition.Delegate,
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("anonymous method with parameters (passed as argument)", async () => {
        const input = Input.InMethod(`M(delegate(int x, int y) { });`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Keyword.Definition.Delegate,
          Token.Punctuation.OpenParen,
          Token.PrimitiveType.Int,
          Token.Identifier.ParameterName("x"),
          Token.Punctuation.Comma,
          Token.PrimitiveType.Int,
          Token.Identifier.ParameterName("y"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("async anonymous method with no parameter list (passed as argument)", async () => {
        const input = Input.InMethod(`M(async delegate { });`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Keyword.Modifier.Async,
          Token.Keyword.Definition.Delegate,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("async anonymous method with empty parameter list (passed as argument)", async () => {
        const input = Input.InMethod(`M(async delegate() { });`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Keyword.Modifier.Async,
          Token.Keyword.Definition.Delegate,
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("async anonymous method with parameters (passed as argument)", async () => {
        const input = Input.InMethod(`M(async delegate(int x, int y) { });`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Keyword.Modifier.Async,
          Token.Keyword.Definition.Delegate,
          Token.Punctuation.OpenParen,
          Token.PrimitiveType.Int,
          Token.Identifier.ParameterName("x"),
          Token.Punctuation.Comma,
          Token.PrimitiveType.Int,
          Token.Identifier.ParameterName("y"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("lambda expression with throw statement passed as argument (issue #90)", async () => {
        const input = Input.InClass(`
[Fact]
public void Method1()
{
    app.Command(_ => throw new InvalidOperationException());
}

[Fact]
public void Method2()
{
    app.Command()
}`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Punctuation.OpenBracket,
          Token.Type("Fact"),
          Token.Punctuation.CloseBracket,
          Token.Keyword.Modifier.Public,
          Token.PrimitiveType.Void,
          Token.Identifier.MethodName("Method1"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.OpenBrace,

          // app.Command(_ => throw new InvalidOperationException());
          Token.Variable.Object("app"),
          Token.Punctuation.Accessor,
          Token.Identifier.MethodName("Command"),
          Token.Punctuation.OpenParen,
          Token.Identifier.ParameterName("_"),
          Token.Operator.Arrow,
          Token.Keyword.Flow.Throw,
          Token.Operator.Expression.New,
          Token.Type("InvalidOperationException"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,

          Token.Punctuation.CloseBrace,
          Token.Punctuation.OpenBracket,
          Token.Type("Fact"),
          Token.Punctuation.CloseBracket,
          Token.Keyword.Modifier.Public,
          Token.PrimitiveType.Void,
          Token.Identifier.MethodName("Method2"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.OpenBrace,

          // app.Command()
          Token.Variable.Object("app"),
          Token.Punctuation.Accessor,
          Token.Identifier.MethodName("Command"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.CloseBrace
        ]);
      });

      it("lambda expression with parameter whose name starts with ref (issue #95)", async () => {
        const input = Input.InMethod(`
var refObjectsToKeep = allRefObjects.Where(refObject => refObject.ShouldKeep);
var intObjectsToKeep = allIntObjects.Where(intObject => intObject.ShouldKeep);
var outObjectsToKeep = allOutObjects.Where(outObject => outObject.ShouldKeep);`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          // var refObjectsToKeep = allRefObjects.Where(refObject => refObject.ShouldKeep);
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("refObjectsToKeep"),
          Token.Operator.Assignment,
          Token.Variable.Object("allRefObjects"),
          Token.Punctuation.Accessor,
          Token.Identifier.MethodName("Where"),
          Token.Punctuation.OpenParen,
          Token.Identifier.ParameterName("refObject"),
          Token.Operator.Arrow,
          Token.Variable.Object("refObject"),
          Token.Punctuation.Accessor,
          Token.Variable.Property("ShouldKeep"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,

          // var intObjectsToKeep = allIntObjects.Where(intObject => intObject.ShouldKeep);
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("intObjectsToKeep"),
          Token.Operator.Assignment,
          Token.Variable.Object("allIntObjects"),
          Token.Punctuation.Accessor,
          Token.Identifier.MethodName("Where"),
          Token.Punctuation.OpenParen,
          Token.Identifier.ParameterName("intObject"),
          Token.Operator.Arrow,
          Token.Variable.Object("intObject"),
          Token.Punctuation.Accessor,
          Token.Variable.Property("ShouldKeep"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,

          // var outObjectsToKeep = allOutObjects.Where(outObject => outObject.ShouldKeep);;
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("outObjectsToKeep"),
          Token.Operator.Assignment,
          Token.Variable.Object("allOutObjects"),
          Token.Punctuation.Accessor,
          Token.Identifier.MethodName("Where"),
          Token.Punctuation.OpenParen,
          Token.Identifier.ParameterName("outObject"),
          Token.Operator.Arrow,
          Token.Variable.Object("outObject"),
          Token.Punctuation.Accessor,
          Token.Variable.Property("ShouldKeep"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("static lambda expression with multiple parameters (passed as argument)", async () => {
        const input = Input.InMethod(`M(static (x, y) => { });`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Keyword.Modifier.Static,
          Token.Punctuation.OpenParen,
          Token.Identifier.ParameterName("x"),
          Token.Punctuation.Comma,
          Token.Identifier.ParameterName("y"),
          Token.Punctuation.CloseParen,
          Token.Operator.Arrow,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("static async lambda expression with multiple parameters (passed as argument)", async () => {
        const input = Input.InMethod(`M(static async (x, y) => { });`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Keyword.Modifier.Static,
          Token.Keyword.Modifier.Async,
          Token.Punctuation.OpenParen,
          Token.Identifier.ParameterName("x"),
          Token.Punctuation.Comma,
          Token.Identifier.ParameterName("y"),
          Token.Punctuation.CloseParen,
          Token.Operator.Arrow,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("lambda expression with tuple to the left and nested parens (issue #77)", async () => {
        const input = Input.InMethod(`M((0, 1)).Select(((int, int) item, int i) => item);`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.OpenParen,
          Token.Literal.Numeric.Decimal("0"),
          Token.Punctuation.Comma,
          Token.Literal.Numeric.Decimal("1"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Accessor,
          Token.Identifier.MethodName("Select"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.OpenParen,
          Token.Punctuation.OpenParen,
          Token.PrimitiveType.Int,
          Token.Punctuation.Comma,
          Token.PrimitiveType.Int,
          Token.Punctuation.CloseParen,
          Token.Identifier.ParameterName("item"),
          Token.Punctuation.Comma,
          Token.PrimitiveType.Int,
          Token.Identifier.ParameterName("i"),
          Token.Punctuation.CloseParen,
          Token.Operator.Arrow,
          Token.Variable.ReadWrite("item"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
        ]);
      });
    });

    describe("Anonymous Objects", () => {
      it("simple - on single line", async () => {
        const input = Input.InMethod(`var x = new { ID = 42 };`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("x"),
          Token.Operator.Assignment,
          Token.Operator.Expression.New,
          Token.Punctuation.OpenBrace,
          Token.Variable.ReadWrite("ID"),
          Token.Operator.Assignment,
          Token.Literal.Numeric.Decimal("42"),
          Token.Punctuation.CloseBrace,
          Token.Punctuation.Semicolon
        ]);
      });

      it("simple - on multiple lines", async () => {
        const input = Input.InMethod(`
var x = new
{
    ID = 42
};`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("x"),
          Token.Operator.Assignment,
          Token.Operator.Expression.New,
          Token.Punctuation.OpenBrace,
          Token.Variable.ReadWrite("ID"),
          Token.Operator.Assignment,
          Token.Literal.Numeric.Decimal("42"),
          Token.Punctuation.CloseBrace,
          Token.Punctuation.Semicolon
        ]);
      });

      it("nested - on single line", async () => {
        const input = Input.InMethod(`var x = new { y = new { ID = 42 } };`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("x"),
          Token.Operator.Assignment,
          Token.Operator.Expression.New,
          Token.Punctuation.OpenBrace,
          Token.Variable.ReadWrite("y"),
          Token.Operator.Assignment,
          Token.Operator.Expression.New,
          Token.Punctuation.OpenBrace,
          Token.Variable.ReadWrite("ID"),
          Token.Operator.Assignment,
          Token.Literal.Numeric.Decimal("42"),
          Token.Punctuation.CloseBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.Semicolon
        ]);
      });

      it("nested - on multiple lines", async () => {
        const input = Input.InMethod(`
var x = new
{
    y = new
    {
        ID = 42
    }
};`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("x"),
          Token.Operator.Assignment,
          Token.Operator.Expression.New,
          Token.Punctuation.OpenBrace,
          Token.Variable.ReadWrite("y"),
          Token.Operator.Assignment,
          Token.Operator.Expression.New,
          Token.Punctuation.OpenBrace,
          Token.Variable.ReadWrite("ID"),
          Token.Operator.Assignment,
          Token.Literal.Numeric.Decimal("42"),
          Token.Punctuation.CloseBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.Semicolon
        ]);
      });

      it("comment before initializer (issue #264)", async () => {
        const input = Input.InMethod(`
var x = new // comment
{
    ID = 42
};`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("x"),
          Token.Operator.Assignment,
          Token.Operator.Expression.New,
          Token.Comment.SingleLine.Start,
          Token.Comment.SingleLine.Text(" comment"),
          Token.Punctuation.OpenBrace,
          Token.Variable.ReadWrite("ID"),
          Token.Operator.Assignment,
          Token.Literal.Numeric.Decimal("42"),
          Token.Punctuation.CloseBrace,
          Token.Punctuation.Semicolon,
        ]);
      });
    });

    describe("Arithmetic", () => {
      it("mixed relational and arithmetic operators", async () => {
        const input = Input.InMethod(`b = this.i != 1 + (2 - 3);`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Variable.ReadWrite("b"),
          Token.Operator.Assignment,
          Token.Variable.This,
          Token.Punctuation.Accessor,
          Token.Variable.Property("i"),
          Token.Operator.Relational.NotEqual,
          Token.Literal.Numeric.Decimal("1"),
          Token.Operator.Arithmetic.Addition,
          Token.Punctuation.OpenParen,
          Token.Literal.Numeric.Decimal("2"),
          Token.Operator.Arithmetic.Subtraction,
          Token.Literal.Numeric.Decimal("3"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });
    });

    describe("Array Creation", () => {
      it("array creation expression passed as argument", async () => {
        const input = Input.InMethod(`c.abst(ref s, new int[] {1, i, i});`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Variable.Object("c"),
          Token.Punctuation.Accessor,
          Token.Identifier.MethodName("abst"),
          Token.Punctuation.OpenParen,
          Token.Keyword.Modifier.Ref,
          Token.Variable.ReadWrite("s"),
          Token.Punctuation.Comma,
          Token.Operator.Expression.New,
          Token.PrimitiveType.Int,
          Token.Punctuation.OpenBracket,
          Token.Punctuation.CloseBracket,
          Token.Punctuation.OpenBrace,
          Token.Literal.Numeric.Decimal("1"),
          Token.Punctuation.Comma,
          Token.Variable.ReadWrite("i"),
          Token.Punctuation.Comma,
          Token.Variable.ReadWrite("i"),
          Token.Punctuation.CloseBrace,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });
    });

    describe("Assignment", () => {

      it("assignment =", async () => {
        const input = Input.InMethod(`x = 1;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Variable.ReadWrite("x"),
          Token.Operator.Assignment,
          Token.Literal.Numeric.Decimal("1"),
          Token.Punctuation.Semicolon
        ]);
      });

      it("compound assignment +=", async () => {
        const input = Input.InMethod(`x += 1;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Variable.ReadWrite("x"),
          Token.Operator.CompoundAssignment.Arithmetic.Addition,
          Token.Literal.Numeric.Decimal("1"),
          Token.Punctuation.Semicolon
        ]);
      });

      it("compound assignment /=", async () => {
        const input = Input.InMethod(`x /= 1;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Variable.ReadWrite("x"),
          Token.Operator.CompoundAssignment.Arithmetic.Division,
          Token.Literal.Numeric.Decimal("1"),
          Token.Punctuation.Semicolon
        ]);
      });

      it("compound assignment *=", async () => {
        const input = Input.InMethod(`x *= 1;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Variable.ReadWrite("x"),
          Token.Operator.CompoundAssignment.Arithmetic.Multiplication,
          Token.Literal.Numeric.Decimal("1"),
          Token.Punctuation.Semicolon
        ]);
      });

      it("compound assignment %=", async () => {
        const input = Input.InMethod(`x %= 1;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Variable.ReadWrite("x"),
          Token.Operator.CompoundAssignment.Arithmetic.Remainder,
          Token.Literal.Numeric.Decimal("1"),
          Token.Punctuation.Semicolon
        ]);
      });

      it("compound assignment -=", async () => {
        const input = Input.InMethod(`x -= 1;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Variable.ReadWrite("x"),
          Token.Operator.CompoundAssignment.Arithmetic.Subtraction,
          Token.Literal.Numeric.Decimal("1"),
          Token.Punctuation.Semicolon
        ]);
      });

      it("compound assignment &=", async () => {
        const input = Input.InMethod(`x &= 1;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Variable.ReadWrite("x"),
          Token.Operator.CompoundAssignment.Bitwise.And,
          Token.Literal.Numeric.Decimal("1"),
          Token.Punctuation.Semicolon
        ]);
      });

      it("compound assignment ^=", async () => {
        const input = Input.InMethod(`x ^= 1;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Variable.ReadWrite("x"),
          Token.Operator.CompoundAssignment.Bitwise.ExclusiveOr,
          Token.Literal.Numeric.Decimal("1"),
          Token.Punctuation.Semicolon
        ]);
      });

      it("compound assignment |=", async () => {
        const input = Input.InMethod(`x |= 1;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Variable.ReadWrite("x"),
          Token.Operator.CompoundAssignment.Bitwise.Or,
          Token.Literal.Numeric.Decimal("1"),
          Token.Punctuation.Semicolon
        ]);
      });

      it("compound assignment <<=", async () => {
        const input = Input.InMethod(`x <<= 1;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Variable.ReadWrite("x"),
          Token.Operator.CompoundAssignment.Bitwise.ShiftLeft,
          Token.Literal.Numeric.Decimal("1"),
          Token.Punctuation.Semicolon
        ]);
      });

      it("compound assignment >>=", async () => {
        const input = Input.InMethod(`x >>= 1;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Variable.ReadWrite("x"),
          Token.Operator.CompoundAssignment.Bitwise.ShiftRight,
          Token.Literal.Numeric.Decimal("1"),
          Token.Punctuation.Semicolon
        ]);
      });

      it("compound assignment >>>=", async () => {
        const input = Input.InMethod(`x >>>= 1;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Variable.ReadWrite("x"),
          Token.Operator.CompoundAssignment.Bitwise.ShiftRightUnsigned,
          Token.Literal.Numeric.Decimal("1"),
          Token.Punctuation.Semicolon
        ]);
      });

      it("compound assignment ??=", async () => {
        const input = Input.InMethod(`x ??= 1;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Variable.ReadWrite("x"),
          Token.Operator.CompoundAssignment.NullCoalescing,
          Token.Literal.Numeric.Decimal("1"),
          Token.Punctuation.Semicolon
        ]);
      });
    });

    describe("Await", () => {
      it("at statement level", async () => {
        const input = Input.InMethod(`await M();`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Operator.Expression.Await,
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("in assignment", async () => {
        const input = Input.InMethod(`var x = await M();`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("x"),
          Token.Operator.Assignment,
          Token.Operator.Expression.Await,
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("passed as argument", async () => {
        const input = Input.InMethod(`M1(await M2());`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M1"),
          Token.Punctuation.OpenParen,
          Token.Operator.Expression.Await,
          Token.Identifier.MethodName("M2"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("statement level (issue #83)", async () => {
        const input = Input.InMethod(`await x;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Operator.Expression.Await,
          Token.Variable.ReadWrite("x"),
          Token.Punctuation.Semicolon
        ]);
      });

      it("await foreach should tokenize correctly as a statement", async () => {
        const input = Input.InMethod(`await foreach (var item in list)
                {

                }

                var i = 1;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Operator.Expression.Await,
          Token.Keyword.Loop.ForEach,
          Token.Punctuation.OpenParen,
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("item"),
          Token.Keyword.Loop.In,
          Token.Variable.ReadWrite("list"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("i"),
          Token.Operator.Assignment,
          Token.Literal.Numeric.Decimal("1"),
          Token.Punctuation.Semicolon
        ]);
      });
    });

    describe("Casts", () => {
      it("cast to built-in type in assignment", async () => {
        const input = Input.InMethod(`var o = (object)42;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("o"),
          Token.Operator.Assignment,
          Token.Punctuation.OpenParen,
          Token.PrimitiveType.Object,
          Token.Punctuation.CloseParen,
          Token.Literal.Numeric.Decimal("42"),
          Token.Punctuation.Semicolon
        ]);
      });

      it("cast to generic type in assignment", async () => {
        const input = Input.InMethod(`var o = (C<int>)42;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("o"),
          Token.Operator.Assignment,
          Token.Punctuation.OpenParen,
          Token.Type("C"),
          Token.Punctuation.TypeParameter.Begin,
          Token.PrimitiveType.Int,
          Token.Punctuation.TypeParameter.End,
          Token.Punctuation.CloseParen,
          Token.Literal.Numeric.Decimal("42"),
          Token.Punctuation.Semicolon
        ]);
      });

      it("cast to tuple type in assignment", async () => {
        const input = Input.InMethod(`var t = ((int x, int y))o;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("t"),
          Token.Operator.Assignment,
          Token.Punctuation.OpenParen,
          Token.Punctuation.OpenParen,
          Token.PrimitiveType.Int,
          Token.Identifier.TupleElementName("x"),
          Token.Punctuation.Comma,
          Token.PrimitiveType.Int,
          Token.Identifier.TupleElementName("y"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.CloseParen,
          Token.Variable.ReadWrite("o"),
          Token.Punctuation.Semicolon
        ]);
      });

      it("passed to invocation", async () => {
        const input = Input.InMethod(`M((int)42);`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.OpenParen,
          Token.PrimitiveType.Int,
          Token.Punctuation.CloseParen,
          Token.Literal.Numeric.Decimal("42"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("chained cast passed to invocation", async () => {
        const input = Input.InMethod(`M((int)(object)42);`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.OpenParen,
          Token.PrimitiveType.Int,
          Token.Punctuation.CloseParen,
          Token.Punctuation.OpenParen,
          Token.PrimitiveType.Object,
          Token.Punctuation.CloseParen,
          Token.Literal.Numeric.Decimal("42"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("as cast of identifier", async () => {
        const input = Input.InMethod(`var x = o as List<Lazy<string>>;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("x"),
          Token.Operator.Assignment,
          Token.Variable.ReadWrite("o"),
          Token.Operator.Expression.As,
          Token.Type("List"),
          Token.Punctuation.TypeParameter.Begin,
          Token.Type("Lazy"),
          Token.Punctuation.TypeParameter.Begin,
          Token.PrimitiveType.String,
          Token.Punctuation.TypeParameter.End,
          Token.Punctuation.TypeParameter.End,
          Token.Punctuation.Semicolon
        ]);
      });

      it("as cast of invocation", async () => {
        const input = Input.InMethod(`var x = M() as List<Lazy<string>>;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("x"),
          Token.Operator.Assignment,
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Operator.Expression.As,
          Token.Type("List"),
          Token.Punctuation.TypeParameter.Begin,
          Token.Type("Lazy"),
          Token.Punctuation.TypeParameter.Begin,
          Token.PrimitiveType.String,
          Token.Punctuation.TypeParameter.End,
          Token.Punctuation.TypeParameter.End,
          Token.Punctuation.Semicolon
        ]);
      });

      it("is cast of identifier", async () => {
        const input = Input.InMethod(`var x = o is List<Lazy<string>>;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("x"),
          Token.Operator.Assignment,
          Token.Variable.ReadWrite("o"),
          Token.Operator.Pattern.Is,
          Token.Type("List"),
          Token.Punctuation.TypeParameter.Begin,
          Token.Type("Lazy"),
          Token.Punctuation.TypeParameter.Begin,
          Token.PrimitiveType.String,
          Token.Punctuation.TypeParameter.End,
          Token.Punctuation.TypeParameter.End,
          Token.Punctuation.Semicolon
        ]);
      });

      it("is cast of invocation", async () => {
        const input = Input.InMethod(`var x = M() is List<Lazy<string>>;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("x"),
          Token.Operator.Assignment,
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Operator.Pattern.Is,
          Token.Type("List"),
          Token.Punctuation.TypeParameter.Begin,
          Token.Type("Lazy"),
          Token.Punctuation.TypeParameter.Begin,
          Token.PrimitiveType.String,
          Token.Punctuation.TypeParameter.End,
          Token.Punctuation.TypeParameter.End,
          Token.Punctuation.Semicolon
        ]);
      });

      it("as type ?? (issue #245)", async () => {
        const input = Input.InMethod(`var a = b as string ?? "";`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("a"),
          Token.Operator.Assignment,
          Token.Variable.ReadWrite("b"),
          Token.Operator.Expression.As,
          Token.PrimitiveType.String,
          Token.Operator.NullCoalescing,
          Token.Punctuation.String.Begin,
          Token.Punctuation.String.End,
          Token.Punctuation.Semicolon,
        ]);
      });

      it("as type? ?? (issue #245)", async () => {
        const input = Input.InMethod(`var a = b as int? ?? 0;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("a"),
          Token.Operator.Assignment,
          Token.Variable.ReadWrite("b"),
          Token.Operator.Expression.As,
          Token.PrimitiveType.Int,
          Token.Punctuation.QuestionMark,
          Token.Operator.NullCoalescing,
          Token.Literal.Numeric.Decimal("0"),
          Token.Punctuation.Semicolon,
        ]);
      });

      it("as type[] ?? (issue #245)", async () => {
        const input = Input.InMethod(`var a = b as int[] ?? new int[0];`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("a"),
          Token.Operator.Assignment,
          Token.Variable.ReadWrite("b"),
          Token.Operator.Expression.As,
          Token.PrimitiveType.Int,
          Token.Punctuation.OpenBracket,
          Token.Punctuation.CloseBracket,
          Token.Operator.NullCoalescing,
          Token.Operator.Expression.New,
          Token.PrimitiveType.Int,
          Token.Punctuation.OpenBracket,
          Token.Literal.Numeric.Decimal("0"),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Semicolon,
        ]);
      });
    });

    describe("Checked/Unchecked", () => {
      it("checked expression", async () => {
        const input = Input.InMethod(`int x = checked(42);`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.Int,
          Token.Identifier.LocalName("x"),
          Token.Operator.Assignment,
          Token.Operator.Expression.Checked,
          Token.Punctuation.OpenParen,
          Token.Literal.Numeric.Decimal("42"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("unchecked expression", async () => {
        const input = Input.InMethod(`int x = unchecked(42);`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.Int,
          Token.Identifier.LocalName("x"),
          Token.Operator.Assignment,
          Token.Operator.Expression.Unchecked,
          Token.Punctuation.OpenParen,
          Token.Literal.Numeric.Decimal("42"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("checked expression inside checked statement", async () => {
        const input = `
class C
{
    void M1()
    {
        checked
        {
            checked(++i);
        }
    }
    void M2() { }
}`;
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Class,
          Token.Identifier.ClassName("C"),
          Token.Punctuation.OpenBrace,
          Token.PrimitiveType.Void,
          Token.Identifier.MethodName("M1"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.OpenBrace,

          Token.Keyword.Context.Checked,
          Token.Punctuation.OpenBrace,
          Token.Operator.Expression.Checked,
          Token.Punctuation.OpenParen,
          Token.Operator.Increment,
          Token.Variable.ReadWrite("i"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
          Token.Punctuation.CloseBrace,

          Token.Punctuation.CloseBrace,
          Token.PrimitiveType.Void,
          Token.Identifier.MethodName("M2"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.CloseBrace
        ]);
      });
    });

    describe("Conditional Operator", () => {
      it("in assignment", async () => {
        const input = Input.InMethod(`var y = x ? 19 : 23;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("y"),
          Token.Operator.Assignment,
          Token.Variable.ReadWrite("x"),
          Token.Operator.Conditional.QuestionMark,
          Token.Literal.Numeric.Decimal("19"),
          Token.Operator.Conditional.Colon,
          Token.Literal.Numeric.Decimal("23"),
          Token.Punctuation.Semicolon
        ]);
      });

      it("passed as argument", async () => {
        const input = Input.InMethod(`M(x ? 19 : 23);`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Variable.ReadWrite("x"),
          Token.Operator.Conditional.QuestionMark,
          Token.Literal.Numeric.Decimal("19"),
          Token.Operator.Conditional.Colon,
          Token.Literal.Numeric.Decimal("23"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("in nested anonymous objects (issue #85)", async () => {
        const input = Input.InMethod(`
var result = list.Select(l => new {
    w = l != null ? new {
        h = l.ToUpper()
    } : null
});`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          // var result = list.Select(l => new {
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("result"),
          Token.Operator.Assignment,
          Token.Variable.Object("list"),
          Token.Punctuation.Accessor,
          Token.Identifier.MethodName("Select"),
          Token.Punctuation.OpenParen,
          Token.Identifier.ParameterName("l"),
          Token.Operator.Arrow,
          Token.Operator.Expression.New,
          Token.Punctuation.OpenBrace,

          // w = l != null ? new {
          Token.Variable.ReadWrite("w"),
          Token.Operator.Assignment,
          Token.Variable.ReadWrite("l"),
          Token.Operator.Relational.NotEqual,
          Token.Literal.Null,
          Token.Operator.Conditional.QuestionMark,
          Token.Operator.Expression.New,
          Token.Punctuation.OpenBrace,

          // h = l.ToUpper()
          Token.Variable.ReadWrite("h"),
          Token.Operator.Assignment,
          Token.Variable.Object("l"),
          Token.Punctuation.Accessor,
          Token.Identifier.MethodName("ToUpper"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,

          // } : null
          Token.Punctuation.CloseBrace,
          Token.Operator.Conditional.Colon,
          Token.Literal.Null,

          // });
          Token.Punctuation.CloseBrace,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });
    });

    describe("Element Access", () => {
      it("no arguments", async () => {
        const input = Input.InMethod(`var o = P[];`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("o"),
          Token.Operator.Assignment,
          Token.Variable.Property("P"),
          Token.Punctuation.OpenBracket,
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Semicolon
        ]);
      });

      it("one argument", async () => {
        const input = Input.InMethod(`var o = P[42];`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("o"),
          Token.Operator.Assignment,
          Token.Variable.Property("P"),
          Token.Punctuation.OpenBracket,
          Token.Literal.Numeric.Decimal("42"),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Semicolon
        ]);
      });

      it("two arguments", async () => {
        const input = Input.InMethod(`var o = P[19, 23];`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("o"),
          Token.Operator.Assignment,
          Token.Variable.Property("P"),
          Token.Punctuation.OpenBracket,
          Token.Literal.Numeric.Decimal("19"),
          Token.Punctuation.Comma,
          Token.Literal.Numeric.Decimal("23"),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Semicolon
        ]);
      });

      it("two named arguments", async () => {
        const input = Input.InMethod(`var o = P[x: 19, y: 23];`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("o"),
          Token.Operator.Assignment,
          Token.Variable.Property("P"),
          Token.Punctuation.OpenBracket,
          Token.Identifier.ParameterName("x"),
          Token.Punctuation.Colon,
          Token.Literal.Numeric.Decimal("19"),
          Token.Punctuation.Comma,
          Token.Identifier.ParameterName("y"),
          Token.Punctuation.Colon,
          Token.Literal.Numeric.Decimal("23"),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Semicolon
        ]);
      });

      it("ref argument", async () => {
        const input = Input.InMethod(`var o = P[ref x];`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("o"),
          Token.Operator.Assignment,
          Token.Variable.Property("P"),
          Token.Punctuation.OpenBracket,
          Token.Keyword.Modifier.Ref,
          Token.Variable.ReadWrite("x"),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Semicolon
        ]);
      });

      it("out argument", async () => {
        const input = Input.InMethod(`var o = P[out x];`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("o"),
          Token.Operator.Assignment,
          Token.Variable.Property("P"),
          Token.Punctuation.OpenBracket,
          Token.Keyword.Modifier.Out,
          Token.Variable.ReadWrite("x"),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Semicolon
        ]);
      });

      it("in argument", async () => {
        const input = Input.InMethod(`var o = P[in x];`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("o"),
          Token.Operator.Assignment,
          Token.Variable.Property("P"),
          Token.Punctuation.OpenBracket,
          Token.Keyword.Modifier.In,
          Token.Variable.ReadWrite("x"),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Semicolon
        ]);
      });

      it("named ref argument", async () => {
        const input = Input.InMethod(`var o = P[x: ref y];`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("o"),
          Token.Operator.Assignment,
          Token.Variable.Property("P"),
          Token.Punctuation.OpenBracket,
          Token.Identifier.ParameterName("x"),
          Token.Punctuation.Colon,
          Token.Keyword.Modifier.Ref,
          Token.Variable.ReadWrite("y"),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Semicolon
        ]);
      });

      it("named out argument", async () => {
        const input = Input.InMethod(`var o = P[x: out y];`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("o"),
          Token.Operator.Assignment,
          Token.Variable.Property("P"),
          Token.Punctuation.OpenBracket,
          Token.Identifier.ParameterName("x"),
          Token.Punctuation.Colon,
          Token.Keyword.Modifier.Out,
          Token.Variable.ReadWrite("y"),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Semicolon
        ]);
      });

      it("named in argument", async () => {
        const input = Input.InMethod(`var o = P[x: in y];`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("o"),
          Token.Operator.Assignment,
          Token.Variable.Property("P"),
          Token.Punctuation.OpenBracket,
          Token.Identifier.ParameterName("x"),
          Token.Punctuation.Colon,
          Token.Keyword.Modifier.In,
          Token.Variable.ReadWrite("y"),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Semicolon
        ]);
      });

      it("out argument declaration", async () => {
        const input = Input.InMethod(`var o = P[out int x, out var y];`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("o"),
          Token.Operator.Assignment,
          Token.Variable.Property("P"),
          Token.Punctuation.OpenBracket,
          Token.Keyword.Modifier.Out,
          Token.PrimitiveType.Int,
          Token.Identifier.LocalName("x"),
          Token.Punctuation.Comma,
          Token.Keyword.Modifier.Out,
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("y"),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Semicolon
        ]);
      });

      it("member of generic with no arguments", async () => {
        const input = Input.InMethod(`var o = C<int>.P[];`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("o"),
          Token.Operator.Assignment,
          Token.Variable.Object("C"),
          Token.Punctuation.TypeParameter.Begin,
          Token.PrimitiveType.Int,
          Token.Punctuation.TypeParameter.End,
          Token.Punctuation.Accessor,
          Token.Variable.Property("P"),
          Token.Punctuation.OpenBracket,
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Semicolon
        ]);
      });

      it("member of qualified generic with no arguments", async () => {
        const input = Input.InMethod(`var o = N.C<int>.P[];`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("o"),
          Token.Operator.Assignment,
          Token.Variable.Object("N"),
          Token.Punctuation.Accessor,
          Token.Variable.Object("C"),
          Token.Punctuation.TypeParameter.Begin,
          Token.PrimitiveType.Int,
          Token.Punctuation.TypeParameter.End,
          Token.Punctuation.Accessor,
          Token.Variable.Property("P"),
          Token.Punctuation.OpenBracket,
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Semicolon
        ]);
      });

      it("member with element access", async () => {
        const input = Input.InMethod(`var a = b.c[0];`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("a"),
          Token.Operator.Assignment,
          Token.Variable.Object("b"),
          Token.Punctuation.Accessor,
          Token.Variable.Property("c"),
          Token.Punctuation.OpenBracket,
          Token.Literal.Numeric.Decimal("0"),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Semicolon
        ]);
      });

      it("member with two element accesses", async () => {
        const input = Input.InMethod(`var a = b.c[19][23];`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("a"),
          Token.Operator.Assignment,
          Token.Variable.Object("b"),
          Token.Punctuation.Accessor,
          Token.Variable.Property("c"),
          Token.Punctuation.OpenBracket,
          Token.Literal.Numeric.Decimal("19"),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.OpenBracket,
          Token.Literal.Numeric.Decimal("23"),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Semicolon
        ]);
      });

      it("member with two element accesses and another member", async () => {
        const input = Input.InMethod(`var a = b.c[19][23].d;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("a"),
          Token.Operator.Assignment,
          Token.Variable.Object("b"),
          Token.Punctuation.Accessor,
          Token.Variable.Property("c"),
          Token.Punctuation.OpenBracket,
          Token.Literal.Numeric.Decimal("19"),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.OpenBracket,
          Token.Literal.Numeric.Decimal("23"),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Accessor,
          Token.Variable.Property("d"),
          Token.Punctuation.Semicolon
        ]);
      });

      it("member with two element accesses and an invocation", async () => {
        const input = Input.InMethod(`var a = b.c[19][23].d();`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("a"),
          Token.Operator.Assignment,
          Token.Variable.Object("b"),
          Token.Punctuation.Accessor,
          Token.Variable.Property("c"),
          Token.Punctuation.OpenBracket,
          Token.Literal.Numeric.Decimal("19"),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.OpenBracket,
          Token.Literal.Numeric.Decimal("23"),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Accessor,
          Token.Identifier.MethodName("d"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("read/write array element", async () => {
        const input = Input.InMethod(`
object[] a1 = {(null), (this.a), c};
a1[1] = ((this.a)); a1[2] = (c); a1[1] = (i);
`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.Object,
          Token.Punctuation.OpenBracket,
          Token.Punctuation.CloseBracket,
          Token.Identifier.LocalName("a1"),
          Token.Operator.Assignment,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.OpenParen,
          Token.Literal.Null,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Comma,
          Token.Punctuation.OpenParen,
          Token.Variable.This,
          Token.Punctuation.Accessor,
          Token.Variable.Property("a"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Comma,
          Token.Variable.ReadWrite("c"),
          Token.Punctuation.CloseBrace,
          Token.Punctuation.Semicolon,

          Token.Variable.Property("a1"),
          Token.Punctuation.OpenBracket,
          Token.Literal.Numeric.Decimal("1"),
          Token.Punctuation.CloseBracket,
          Token.Operator.Assignment,
          Token.Punctuation.OpenParen,
          Token.Punctuation.OpenParen,
          Token.Variable.This,
          Token.Punctuation.Accessor,
          Token.Variable.Property("a"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
          Token.Variable.Property("a1"),
          Token.Punctuation.OpenBracket,
          Token.Literal.Numeric.Decimal("2"),
          Token.Punctuation.CloseBracket,
          Token.Operator.Assignment,
          Token.Punctuation.OpenParen,
          Token.Variable.ReadWrite("c"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
          Token.Variable.Property("a1"),
          Token.Punctuation.OpenBracket,
          Token.Literal.Numeric.Decimal("1"),
          Token.Punctuation.CloseBracket,
          Token.Operator.Assignment,
          Token.Punctuation.OpenParen,
          Token.Variable.ReadWrite("i"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("arithmetic expression with multiple element accesses 1 (issue #37)", async () => {
        const input = Input.InMethod(`
long total = data["bonusGame"]["win"].AsLong * data["bonusGame"]["betMult"].AsLong;
`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.Long,
          Token.Identifier.LocalName("total"),
          Token.Operator.Assignment,
          Token.Variable.Property("data"),
          Token.Punctuation.OpenBracket,
          Token.Punctuation.String.Begin,
          Token.Literal.String("bonusGame"),
          Token.Punctuation.String.End,
          Token.Punctuation.CloseBracket,
          Token.Punctuation.OpenBracket,
          Token.Punctuation.String.Begin,
          Token.Literal.String("win"),
          Token.Punctuation.String.End,
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Accessor,
          Token.Variable.Property("AsLong"),
          Token.Operator.Arithmetic.Multiplication,
          Token.Variable.Property("data"),
          Token.Punctuation.OpenBracket,
          Token.Punctuation.String.Begin,
          Token.Literal.String("bonusGame"),
          Token.Punctuation.String.End,
          Token.Punctuation.CloseBracket,
          Token.Punctuation.OpenBracket,
          Token.Punctuation.String.Begin,
          Token.Literal.String("betMult"),
          Token.Punctuation.String.End,
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Accessor,
          Token.Variable.Property("AsLong"),
          Token.Punctuation.Semicolon
        ]);
      });

      it("arithmetic expression with multiple element accesses 2 (issue #37)", async () => {
        const input = Input.InMethod(`
total = data["bonusGame"]["win"].AsLong * data["bonusGame"]["betMult"].AsLong;
`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Variable.ReadWrite("total"),
          Token.Operator.Assignment,
          Token.Variable.Property("data"),
          Token.Punctuation.OpenBracket,
          Token.Punctuation.String.Begin,
          Token.Literal.String("bonusGame"),
          Token.Punctuation.String.End,
          Token.Punctuation.CloseBracket,
          Token.Punctuation.OpenBracket,
          Token.Punctuation.String.Begin,
          Token.Literal.String("win"),
          Token.Punctuation.String.End,
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Accessor,
          Token.Variable.Property("AsLong"),
          Token.Operator.Arithmetic.Multiplication,
          Token.Variable.Property("data"),
          Token.Punctuation.OpenBracket,
          Token.Punctuation.String.Begin,
          Token.Literal.String("bonusGame"),
          Token.Punctuation.String.End,
          Token.Punctuation.CloseBracket,
          Token.Punctuation.OpenBracket,
          Token.Punctuation.String.Begin,
          Token.Literal.String("betMult"),
          Token.Punctuation.String.End,
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Accessor,
          Token.Variable.Property("AsLong"),
          Token.Punctuation.Semicolon
        ]);
      });

      it("arithmetic expression with multiple element accesses 3 (issue #37)", async () => {
        const input = Input.InMethod(`
long total = (data["bonusGame"]["win"].AsLong) * data["bonusGame"]["betMult"].AsLong;
`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.Long,
          Token.Identifier.LocalName("total"),
          Token.Operator.Assignment,
          Token.Punctuation.OpenParen,
          Token.Variable.Property("data"),
          Token.Punctuation.OpenBracket,
          Token.Punctuation.String.Begin,
          Token.Literal.String("bonusGame"),
          Token.Punctuation.String.End,
          Token.Punctuation.CloseBracket,
          Token.Punctuation.OpenBracket,
          Token.Punctuation.String.Begin,
          Token.Literal.String("win"),
          Token.Punctuation.String.End,
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Accessor,
          Token.Variable.Property("AsLong"),
          Token.Punctuation.CloseParen,
          Token.Operator.Arithmetic.Multiplication,
          Token.Variable.Property("data"),
          Token.Punctuation.OpenBracket,
          Token.Punctuation.String.Begin,
          Token.Literal.String("bonusGame"),
          Token.Punctuation.String.End,
          Token.Punctuation.CloseBracket,
          Token.Punctuation.OpenBracket,
          Token.Punctuation.String.Begin,
          Token.Literal.String("betMult"),
          Token.Punctuation.String.End,
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Accessor,
          Token.Variable.Property("AsLong"),
          Token.Punctuation.Semicolon
        ]);
      });
    });

    describe("Invocations", () => {
      it("no arguments", async () => {
        const input = Input.InMethod(`M();`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("no arguments with space (issue #54)", async () => {
        const input = Input.InMethod(`M ();`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("one argument", async () => {
        const input = Input.InMethod(`M(42);`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Literal.Numeric.Decimal("42"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("one argument with space (issue #54)", async () => {
        const input = Input.InMethod(`M (42);`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Literal.Numeric.Decimal("42"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("two arguments", async () => {
        const input = Input.InMethod(`M(19, 23);`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Literal.Numeric.Decimal("19"),
          Token.Punctuation.Comma,
          Token.Literal.Numeric.Decimal("23"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("two named arguments", async () => {
        const input = Input.InMethod(`M(x: 19, y: 23);`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Identifier.ParameterName("x"),
          Token.Punctuation.Colon,
          Token.Literal.Numeric.Decimal("19"),
          Token.Punctuation.Comma,
          Token.Identifier.ParameterName("y"),
          Token.Punctuation.Colon,
          Token.Literal.Numeric.Decimal("23"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("ref argument", async () => {
        const input = Input.InMethod(`M(ref x);`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Keyword.Modifier.Ref,
          Token.Variable.ReadWrite("x"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("out argument", async () => {
        const input = Input.InMethod(`M(out x);`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Keyword.Modifier.Out,
          Token.Variable.ReadWrite("x"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("in argument", async () => {
        const input = Input.InMethod(`M(in x);`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Keyword.Modifier.In,
          Token.Variable.ReadWrite("x"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("named ref argument", async () => {
        const input = Input.InMethod(`M(x: ref y);`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Identifier.ParameterName("x"),
          Token.Punctuation.Colon,
          Token.Keyword.Modifier.Ref,
          Token.Variable.ReadWrite("y"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("named out argument", async () => {
        const input = Input.InMethod(`M(x: out y);`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Identifier.ParameterName("x"),
          Token.Punctuation.Colon,
          Token.Keyword.Modifier.Out,
          Token.Variable.ReadWrite("y"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("named in argument", async () => {
        const input = Input.InMethod(`M(x: in y);`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Identifier.ParameterName("x"),
          Token.Punctuation.Colon,
          Token.Keyword.Modifier.In,
          Token.Variable.ReadWrite("y"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("out argument declaration", async () => {
        const input = Input.InMethod(`M(out int x, out var y);`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Keyword.Modifier.Out,
          Token.PrimitiveType.Int,
          Token.Identifier.LocalName("x"),
          Token.Punctuation.Comma,
          Token.Keyword.Modifier.Out,
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("y"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("generic with no arguments", async () => {
        const input = Input.InMethod(`M<int>();`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.TypeParameter.Begin,
          Token.PrimitiveType.Int,
          Token.Punctuation.TypeParameter.End,
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("nested generic with no arguments", async () => {
        const input = Input.InMethod(`M<T<int>>();`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.TypeParameter.Begin,
          Token.Type("T"),
          Token.Punctuation.TypeParameter.Begin,
          Token.PrimitiveType.Int,
          Token.Punctuation.TypeParameter.End,
          Token.Punctuation.TypeParameter.End,
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("double-nested generic with no arguments", async () => {
        const input = Input.InMethod(`M<T<U<int>>>();`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.TypeParameter.Begin,
          Token.Type("T"),
          Token.Punctuation.TypeParameter.Begin,
          Token.Type("U"),
          Token.Punctuation.TypeParameter.Begin,
          Token.PrimitiveType.Int,
          Token.Punctuation.TypeParameter.End,
          Token.Punctuation.TypeParameter.End,
          Token.Punctuation.TypeParameter.End,
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("generic with parentheses (issue #200)", async () => {
        const input = Input.InMethod(`
v = (a << b) >> (c);
f(A<B,C>(D+E));
f(A<B,(C>(D+E)));
f(A<(B,C)>(D+E));`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Variable.ReadWrite("v"),
          Token.Operator.Assignment,
          Token.Punctuation.OpenParen,
          Token.Variable.ReadWrite("a"),
          Token.Operator.Bitwise.ShiftLeft,
          Token.Variable.ReadWrite("b"),
          Token.Punctuation.CloseParen,
          Token.Operator.Bitwise.ShiftRight,
          Token.Punctuation.OpenParen,
          Token.Variable.ReadWrite("c"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,

          Token.Identifier.MethodName("f"),
          Token.Punctuation.OpenParen,
          Token.Identifier.MethodName("A"),
          Token.Punctuation.TypeParameter.Begin,
          Token.Type("B"),
          Token.Punctuation.Comma,
          Token.Type("C"),
          Token.Punctuation.TypeParameter.End,
          Token.Punctuation.OpenParen,
          Token.Variable.ReadWrite("D"),
          Token.Operator.Arithmetic.Addition,
          Token.Variable.ReadWrite("E"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,

          Token.Identifier.MethodName("f"),
          Token.Punctuation.OpenParen,
          Token.Variable.ReadWrite("A"),
          Token.Operator.Relational.LessThan,
          Token.Variable.ReadWrite("B"),
          Token.Punctuation.Comma,
          Token.Punctuation.OpenParen,
          Token.Variable.ReadWrite("C"),
          Token.Operator.Relational.GreaterThan,
          Token.Punctuation.OpenParen,
          Token.Variable.ReadWrite("D"),
          Token.Operator.Arithmetic.Addition,
          Token.Variable.ReadWrite("E"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,

          Token.Identifier.MethodName("f"),
          Token.Punctuation.OpenParen,
          Token.Identifier.MethodName("A"),
          Token.Punctuation.TypeParameter.Begin,
          Token.Punctuation.OpenParen,
          Token.Type("B"),
          Token.Punctuation.Comma,
          Token.Type("C"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.TypeParameter.End,
          Token.Punctuation.OpenParen,
          Token.Variable.ReadWrite("D"),
          Token.Operator.Arithmetic.Addition,
          Token.Variable.ReadWrite("E"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
        ]);
      });

      it("member of generic with no arguments", async () => {
        const input = Input.InMethod(`C<int>.M();`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Variable.Object("C"),
          Token.Punctuation.TypeParameter.Begin,
          Token.PrimitiveType.Int,
          Token.Punctuation.TypeParameter.End,
          Token.Punctuation.Accessor,
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("member of qualified generic with no arguments", async () => {
        const input = Input.InMethod(`N.C<int>.M();`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Variable.Object("N"),
          Token.Punctuation.Accessor,
          Token.Variable.Object("C"),
          Token.Punctuation.TypeParameter.Begin,
          Token.PrimitiveType.Int,
          Token.Punctuation.TypeParameter.End,
          Token.Punctuation.Accessor,
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("store result of member of qualified generic with no arguments", async () => {
        const input = Input.InMethod(`var o = N.C<int>.M();`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("o"),
          Token.Operator.Assignment,
          Token.Variable.Object("N"),
          Token.Punctuation.Accessor,
          Token.Variable.Object("C"),
          Token.Punctuation.TypeParameter.Begin,
          Token.PrimitiveType.Int,
          Token.Punctuation.TypeParameter.End,
          Token.Punctuation.Accessor,
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("store result of qualified method with no arguments", async () => {
        const input = Input.InMethod(`var o = N.C.M();`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("o"),
          Token.Operator.Assignment,
          Token.Variable.Object("N"),
          Token.Punctuation.Accessor,
          Token.Variable.Property("C"),
          Token.Punctuation.Accessor,
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("qualified method with no arguments and space 1 (issue #54)", async () => {
        const input = Input.InMethod(`N.C.M ();`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Variable.Object("N"),
          Token.Punctuation.Accessor,
          Token.Variable.Property("C"),
          Token.Punctuation.Accessor,
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("qualified method with no arguments and space 2 (issue #54)", async () => {
        const input = Input.InMethod(`C.M ();`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Variable.Object("C"),
          Token.Punctuation.Accessor,
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("store result of this.qualified method with no arguments", async () => {
        const input = Input.InMethod(`var o = this.C.M();`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("o"),
          Token.Operator.Assignment,
          Token.Variable.This,
          Token.Punctuation.Accessor,
          Token.Variable.Property("C"),
          Token.Punctuation.Accessor,
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("store result of invocation with two named arguments", async () => {
        const input = Input.InMethod(`var o = M(x: 19, y: 23);`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("o"),
          Token.Operator.Assignment,
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Identifier.ParameterName("x"),
          Token.Punctuation.Colon,
          Token.Literal.Numeric.Decimal("19"),
          Token.Punctuation.Comma,
          Token.Identifier.ParameterName("y"),
          Token.Punctuation.Colon,
          Token.Literal.Numeric.Decimal("23"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("multiplicated parameters (issue #99)", async () => {
        const input = Input.InMethod(`Multiply(n1 * n2);`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("Multiply"),
          Token.Punctuation.OpenParen,
          Token.Variable.ReadWrite("n1"),
          Token.Operator.Arithmetic.Multiplication,
          Token.Variable.ReadWrite("n2"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("chained method calls", async () => {
        const input = Input.InMethod(`M1().M2();`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M1"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Accessor,
          Token.Identifier.MethodName("M2"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("chained invocations with lambda expression arguments", async () => {
        const input = Input.InMethod(`M1(x => x).M2(x => x);`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M1"),
          Token.Punctuation.OpenParen,
          Token.Identifier.ParameterName("x"),
          Token.Operator.Arrow,
          Token.Variable.ReadWrite("x"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Accessor,
          Token.Identifier.MethodName("M2"),
          Token.Punctuation.OpenParen,
          Token.Identifier.ParameterName("x"),
          Token.Operator.Arrow,
          Token.Variable.ReadWrite("x"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("chained invocations with lambda expression arguments, each with single parenthesized parameter", async () => {
        const input = Input.InMethod(`M1((x) => x).M2((x) => x);`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M1"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.OpenParen,
          Token.Identifier.ParameterName("x"),
          Token.Punctuation.CloseParen,
          Token.Operator.Arrow,
          Token.Variable.ReadWrite("x"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Accessor,
          Token.Identifier.MethodName("M2"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.OpenParen,
          Token.Identifier.ParameterName("x"),
          Token.Punctuation.CloseParen,
          Token.Operator.Arrow,
          Token.Variable.ReadWrite("x"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("chained invocations with multiple lambda expression arguments", async () => {
        const input = Input.InMethod(`M1(x => x, y => y).M2(x => x, y => y);`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M1"),
          Token.Punctuation.OpenParen,
          Token.Identifier.ParameterName("x"),
          Token.Operator.Arrow,
          Token.Variable.ReadWrite("x"),
          Token.Punctuation.Comma,
          Token.Identifier.ParameterName("y"),
          Token.Operator.Arrow,
          Token.Variable.ReadWrite("y"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Accessor,
          Token.Identifier.MethodName("M2"),
          Token.Punctuation.OpenParen,
          Token.Identifier.ParameterName("x"),
          Token.Operator.Arrow,
          Token.Variable.ReadWrite("x"),
          Token.Punctuation.Comma,
          Token.Identifier.ParameterName("y"),
          Token.Operator.Arrow,
          Token.Variable.ReadWrite("y"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("chained invocations with multiple lambda expression arguments (with parenthesized parameters)", async () => {
        const input = Input.InMethod(
          `M1((x) => x, (y) => y).M2((x) => x, (y) => y);`
        );
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M1"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.OpenParen,
          Token.Identifier.ParameterName("x"),
          Token.Punctuation.CloseParen,
          Token.Operator.Arrow,
          Token.Variable.ReadWrite("x"),
          Token.Punctuation.Comma,
          Token.Punctuation.OpenParen,
          Token.Identifier.ParameterName("y"),
          Token.Punctuation.CloseParen,
          Token.Operator.Arrow,
          Token.Variable.ReadWrite("y"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Accessor,
          Token.Identifier.MethodName("M2"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.OpenParen,
          Token.Identifier.ParameterName("x"),
          Token.Punctuation.CloseParen,
          Token.Operator.Arrow,
          Token.Variable.ReadWrite("x"),
          Token.Punctuation.Comma,
          Token.Punctuation.OpenParen,
          Token.Identifier.ParameterName("y"),
          Token.Punctuation.CloseParen,
          Token.Operator.Arrow,
          Token.Variable.ReadWrite("y"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("multiple invocations with lambda expressions (issue #47)", async () => {
        const input = Input.InClass(`
void CandleLightOffSecond(int index)
{
    DOTween.ToAlpha(() => FSItems[index].CandleSecond.startColor, (x) => FSItems[index].CandleSecond.startColor = x, 0f, 1f).OnComplete(() => DisableCandleFX(index));
    DOTween.ToAlpha(() => FSItems[index].CandleSecond.startColor, (x) => FSItems[index].CandleSecond.startColor = x, 0f, 1f);
}`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.Void,
          Token.Identifier.MethodName("CandleLightOffSecond"),
          Token.Punctuation.OpenParen,
          Token.PrimitiveType.Int,
          Token.Identifier.ParameterName("index"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.OpenBrace,

          Token.Variable.Object("DOTween"),
          Token.Punctuation.Accessor,
          Token.Identifier.MethodName("ToAlpha"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Operator.Arrow,
          Token.Variable.Property("FSItems"),
          Token.Punctuation.OpenBracket,
          Token.Variable.ReadWrite("index"),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Accessor,
          Token.Variable.Property("CandleSecond"),
          Token.Punctuation.Accessor,
          Token.Variable.Property("startColor"),
          Token.Punctuation.Comma,
          Token.Punctuation.OpenParen,
          Token.Identifier.ParameterName("x"),
          Token.Punctuation.CloseParen,
          Token.Operator.Arrow,
          Token.Variable.Property("FSItems"),
          Token.Punctuation.OpenBracket,
          Token.Variable.ReadWrite("index"),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Accessor,
          Token.Variable.Property("CandleSecond"),
          Token.Punctuation.Accessor,
          Token.Variable.Property("startColor"),
          Token.Operator.Assignment,
          Token.Variable.ReadWrite("x"),
          Token.Punctuation.Comma,
          Token.Literal.Numeric.Decimal("0"),
          Token.Literal.Numeric.Other.Suffix("f"),
          Token.Punctuation.Comma,
          Token.Literal.Numeric.Decimal("1"),
          Token.Literal.Numeric.Other.Suffix("f"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Accessor,
          Token.Identifier.MethodName("OnComplete"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Operator.Arrow,
          Token.Identifier.MethodName("DisableCandleFX"),
          Token.Punctuation.OpenParen,
          Token.Variable.ReadWrite("index"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,

          Token.Variable.Object("DOTween"),
          Token.Punctuation.Accessor,
          Token.Identifier.MethodName("ToAlpha"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Operator.Arrow,
          Token.Variable.Property("FSItems"),
          Token.Punctuation.OpenBracket,
          Token.Variable.ReadWrite("index"),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Accessor,
          Token.Variable.Property("CandleSecond"),
          Token.Punctuation.Accessor,
          Token.Variable.Property("startColor"),
          Token.Punctuation.Comma,
          Token.Punctuation.OpenParen,
          Token.Identifier.ParameterName("x"),
          Token.Punctuation.CloseParen,
          Token.Operator.Arrow,
          Token.Variable.Property("FSItems"),
          Token.Punctuation.OpenBracket,
          Token.Variable.ReadWrite("index"),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Accessor,
          Token.Variable.Property("CandleSecond"),
          Token.Punctuation.Accessor,
          Token.Variable.Property("startColor"),
          Token.Operator.Assignment,
          Token.Variable.ReadWrite("x"),
          Token.Punctuation.Comma,
          Token.Literal.Numeric.Decimal("0"),
          Token.Literal.Numeric.Other.Suffix("f"),
          Token.Punctuation.Comma,
          Token.Literal.Numeric.Decimal("1"),
          Token.Literal.Numeric.Other.Suffix("f"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,

          Token.Punctuation.CloseBrace
        ]);
      });
    });

    describe("nameof", () => {
      it("in assignment", async () => {
        const input = Input.InMethod(`const int x = nameof(x);`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Modifier.Const,
          Token.PrimitiveType.Int,
          Token.Identifier.LocalName("x"),
          Token.Operator.Assignment,
          Token.Operator.Expression.NameOf,
          Token.Punctuation.OpenParen,
          Token.Variable.ReadWrite("x"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });
    });

    describe("Null-coalescing Operator", () => {
      it("in assignment", async () => {
        const input = Input.InMethod(`var y = x ?? new object();`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("y"),
          Token.Operator.Assignment,
          Token.Variable.ReadWrite("x"),
          Token.Operator.NullCoalescing,
          Token.Operator.Expression.New,
          Token.PrimitiveType.Object,
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("passed as argument", async () => {
        const input = Input.InMethod(`M(x ?? new object());`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifier.MethodName("M"),
          Token.Punctuation.OpenParen,
          Token.Variable.ReadWrite("x"),
          Token.Operator.NullCoalescing,
          Token.Operator.Expression.New,
          Token.PrimitiveType.Object,
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });
    });

    describe("Null-conditional Operator", () => {
      it("before dot 1", async () => {
        const input = Input.InMethod(`var a = b?.c;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("a"),
          Token.Operator.Assignment,
          Token.Variable.Object("b"),
          Token.Operator.NullConditional,
          Token.Punctuation.Accessor,
          Token.Variable.Property("c"),
          Token.Punctuation.Semicolon
        ]);
      });

      it("before dot 2", async () => {
        const input = Input.InMethod(`var a = b.c?.d;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("a"),
          Token.Operator.Assignment,
          Token.Variable.Object("b"),
          Token.Punctuation.Accessor,
          Token.Variable.Property("c"),
          Token.Operator.NullConditional,
          Token.Punctuation.Accessor,
          Token.Variable.Property("d"),
          Token.Punctuation.Semicolon
        ]);
      });

      it("in element access 1", async () => {
        const input = Input.InMethod(`var a = b.c?[0];`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("a"),
          Token.Operator.Assignment,
          Token.Variable.Object("b"),
          Token.Punctuation.Accessor,
          Token.Variable.Property("c"),
          Token.Operator.NullConditional,
          Token.Punctuation.OpenBracket,
          Token.Literal.Numeric.Decimal("0"),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Semicolon
        ]);
      });

      it("in element access 2", async () => {
        const input = Input.InMethod(`var a = b.c?.d?[0];`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("a"),
          Token.Operator.Assignment,
          Token.Variable.Object("b"),
          Token.Punctuation.Accessor,
          Token.Variable.Property("c"),
          Token.Operator.NullConditional,
          Token.Punctuation.Accessor,
          Token.Variable.Property("d"),
          Token.Operator.NullConditional,
          Token.Punctuation.OpenBracket,
          Token.Literal.Numeric.Decimal("0"),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Semicolon
        ]);
      });

      it("before element access", async () => {
        const input = Input.InMethod(`var a = b.c[0];`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("a"),
          Token.Operator.Assignment,
          Token.Variable.Object("b"),
          Token.Punctuation.Accessor,
          Token.Variable.Property("c"),
          Token.Punctuation.OpenBracket,
          Token.Literal.Numeric.Decimal("0"),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Semicolon
        ]);
      });

      it("before invocation", async () => {
        const input = Input.InMethod(`var a = b?.c());`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("a"),
          Token.Operator.Assignment,
          Token.Variable.Object("b"),
          Token.Operator.NullConditional,
          Token.Punctuation.Accessor,
          Token.Identifier.MethodName("c"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });
    });

    describe("Other Operators", () => {
      it("Range operator", async () => {
        const input = Input.InMethod(`Range slice = 0..1;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Type("Range"),
          Token.Identifier.LocalName("slice"),
          Token.Operator.Assignment,
          Token.Literal.Numeric.Decimal("0"),
          Token.Operator.Range,
          Token.Literal.Numeric.Decimal("1"),
          Token.Punctuation.Semicolon,
        ]);
      });
    });

    describe("Pointer Member Access Operator", () => {
      it("member access", async () => {
        const input = Input.InMethod(`var a = b->c->d;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("a"),
          Token.Operator.Assignment,
          Token.Variable.Object("b"),
          Token.Punctuation.AccessorPointer,
          Token.Variable.Property("c"),
          Token.Punctuation.AccessorPointer,
          Token.Variable.Property("d"),
          Token.Punctuation.Semicolon,
        ]);
      });

      it("before element access", async () => {
        const input = Input.InMethod(`var a = b->c[0];`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("a"),
          Token.Operator.Assignment,
          Token.Variable.Object("b"),
          Token.Punctuation.AccessorPointer,
          Token.Variable.Property("c"),
          Token.Punctuation.OpenBracket,
          Token.Literal.Numeric.Decimal("0"),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Semicolon,
        ]);
      });

      it("before invocation", async () => {
        const input = Input.InMethod(`var a = b->c();`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("a"),
          Token.Operator.Assignment,
          Token.Variable.Object("b"),
          Token.Punctuation.AccessorPointer,
          Token.Identifier.MethodName("c"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
        ]);
      });
    });

    describe("Primary", () => {
      it("default", async () => {
        const input = Input.InMethod(`var t = default(List<>);`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("t"),
          Token.Operator.Assignment,
          Token.Operator.Expression.Default,
          Token.Punctuation.OpenParen,
          Token.Type("List"),
          Token.Punctuation.TypeParameter.Begin,
          Token.Punctuation.TypeParameter.End,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("default literal", async () => {
        const input = Input.InMethod(`int t = default;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.Int,
          Token.Identifier.LocalName("t"),
          Token.Operator.Assignment,
          Token.Operator.Expression.Default,
          Token.Punctuation.Semicolon
        ]);
      });

      it("typeof", async () => {
        const input = Input.InMethod(`var t = typeof(List<>);`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("t"),
          Token.Operator.Assignment,
          Token.Operator.Expression.TypeOf,
          Token.Punctuation.OpenParen,
          Token.Type("List"),
          Token.Punctuation.TypeParameter.Begin,
          Token.Punctuation.TypeParameter.End,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });
    });

    describe("Queries", () => {
      it("from clause", async () => {
        const input = Input.InMethod(`var q = from n in numbers`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("q"),
          Token.Operator.Assignment,
          Token.Operator.Query.From,
          Token.Identifier.RangeVariableName("n"),
          Token.Operator.Query.In,
          Token.Variable.ReadWrite("numbers")
        ]);
      });

      it("from clause with type", async () => {
        const input = Input.InMethod(`var q = from int n in numbers`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("q"),
          Token.Operator.Assignment,
          Token.Operator.Query.From,
          Token.PrimitiveType.Int,
          Token.Identifier.RangeVariableName("n"),
          Token.Operator.Query.In,
          Token.Variable.ReadWrite("numbers")
        ]);
      });

      it("from clause followed by from clause", async () => {
        const input = Input.InMethod(`
var q = from x in list1
        from y in list2
`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("q"),
          Token.Operator.Assignment,
          Token.Operator.Query.From,
          Token.Identifier.RangeVariableName("x"),
          Token.Operator.Query.In,
          Token.Variable.ReadWrite("list1"),
          Token.Operator.Query.From,
          Token.Identifier.RangeVariableName("y"),
          Token.Operator.Query.In,
          Token.Variable.ReadWrite("list2")
        ]);
      });

      it("from clause, join clause", async () => {
        const input = Input.InMethod(`
var q = from c in customers
        join o in orders on c.CustomerID equals o.CustomerID
`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("q"),
          Token.Operator.Assignment,
          Token.Operator.Query.From,
          Token.Identifier.RangeVariableName("c"),
          Token.Operator.Query.In,
          Token.Variable.ReadWrite("customers"),
          Token.Operator.Query.Join,
          Token.Identifier.RangeVariableName("o"),
          Token.Operator.Query.In,
          Token.Variable.ReadWrite("orders"),
          Token.Operator.Query.On,
          Token.Variable.Object("c"),
          Token.Punctuation.Accessor,
          Token.Variable.Property("CustomerID"),
          Token.Operator.Query.Equals,
          Token.Variable.Object("o"),
          Token.Punctuation.Accessor,
          Token.Variable.Property("CustomerID")
        ]);
      });

      it("from clause, join-into clause", async () => {
        const input = Input.InMethod(`
var q = from c in customers
        join o in orders on c.CustomerID equals o.CustomerID into co
`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("q"),
          Token.Operator.Assignment,
          Token.Operator.Query.From,
          Token.Identifier.RangeVariableName("c"),
          Token.Operator.Query.In,
          Token.Variable.ReadWrite("customers"),
          Token.Operator.Query.Join,
          Token.Identifier.RangeVariableName("o"),
          Token.Operator.Query.In,
          Token.Variable.ReadWrite("orders"),
          Token.Operator.Query.On,
          Token.Variable.Object("c"),
          Token.Punctuation.Accessor,
          Token.Variable.Property("CustomerID"),
          Token.Operator.Query.Equals,
          Token.Variable.Object("o"),
          Token.Punctuation.Accessor,
          Token.Variable.Property("CustomerID"),
          Token.Operator.Query.Into,
          Token.Identifier.RangeVariableName("co")
        ]);
      });

      it("from clause, orderby", async () => {
        const input = Input.InMethod(`
var q = from o in orders
        orderby o.Customer.Name, o.Total
`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("q"),
          Token.Operator.Assignment,
          Token.Operator.Query.From,
          Token.Identifier.RangeVariableName("o"),
          Token.Operator.Query.In,
          Token.Variable.ReadWrite("orders"),
          Token.Operator.Query.OrderBy,
          Token.Variable.Object("o"),
          Token.Punctuation.Accessor,
          Token.Variable.Property("Customer"),
          Token.Punctuation.Accessor,
          Token.Variable.Property("Name"),
          Token.Punctuation.Comma,
          Token.Variable.Object("o"),
          Token.Punctuation.Accessor,
          Token.Variable.Property("Total")
        ]);
      });

      it("from clause, orderby ascending", async () => {
        const input = Input.InMethod(`
var q = from o in orders
        orderby o.Customer.Name ascending, o.Total
`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("q"),
          Token.Operator.Assignment,
          Token.Operator.Query.From,
          Token.Identifier.RangeVariableName("o"),
          Token.Operator.Query.In,
          Token.Variable.ReadWrite("orders"),
          Token.Operator.Query.OrderBy,
          Token.Variable.Object("o"),
          Token.Punctuation.Accessor,
          Token.Variable.Property("Customer"),
          Token.Punctuation.Accessor,
          Token.Variable.Property("Name"),
          Token.Operator.Query.Ascending,
          Token.Punctuation.Comma,
          Token.Variable.Object("o"),
          Token.Punctuation.Accessor,
          Token.Variable.Property("Total")
        ]);
      });

      it("from clause, orderby descending", async () => {
        const input = Input.InMethod(`
var q = from o in orders
        orderby o.Customer.Name, o.Total descending
`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("q"),
          Token.Operator.Assignment,
          Token.Operator.Query.From,
          Token.Identifier.RangeVariableName("o"),
          Token.Operator.Query.In,
          Token.Variable.ReadWrite("orders"),
          Token.Operator.Query.OrderBy,
          Token.Variable.Object("o"),
          Token.Punctuation.Accessor,
          Token.Variable.Property("Customer"),
          Token.Punctuation.Accessor,
          Token.Variable.Property("Name"),
          Token.Punctuation.Comma,
          Token.Variable.Object("o"),
          Token.Punctuation.Accessor,
          Token.Variable.Property("Total"),
          Token.Operator.Query.Descending
        ]);
      });

      it("from and select", async () => {
        const input = Input.InMethod(`
var q = from n in numbers
        select n;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("q"),
          Token.Operator.Assignment,
          Token.Operator.Query.From,
          Token.Identifier.RangeVariableName("n"),
          Token.Operator.Query.In,
          Token.Variable.ReadWrite("numbers"),
          Token.Operator.Query.Select,
          Token.Variable.ReadWrite("n"),
          Token.Punctuation.Semicolon
        ]);
      });

      it("from and select with complex expressions", async () => {
        const input = Input.InMethod(`
var q = from n in new[] { 1, 3, 5, 7, 9 }
        select n % 4 * 6;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("q"),
          Token.Operator.Assignment,
          Token.Operator.Query.From,
          Token.Identifier.RangeVariableName("n"),
          Token.Operator.Query.In,
          Token.Operator.Expression.New,
          Token.Punctuation.OpenBracket,
          Token.Punctuation.CloseBracket,
          Token.Punctuation.OpenBrace,
          Token.Literal.Numeric.Decimal("1"),
          Token.Punctuation.Comma,
          Token.Literal.Numeric.Decimal("3"),
          Token.Punctuation.Comma,
          Token.Literal.Numeric.Decimal("5"),
          Token.Punctuation.Comma,
          Token.Literal.Numeric.Decimal("7"),
          Token.Punctuation.Comma,
          Token.Literal.Numeric.Decimal("9"),
          Token.Punctuation.CloseBrace,
          Token.Operator.Query.Select,
          Token.Variable.ReadWrite("n"),
          Token.Operator.Arithmetic.Remainder,
          Token.Literal.Numeric.Decimal("4"),
          Token.Operator.Arithmetic.Multiplication,
          Token.Literal.Numeric.Decimal("6"),
          Token.Punctuation.Semicolon
        ]);
      });

      it("from and group by", async () => {
        const input = Input.InMethod(`
var q = from c in customers
        group c by c.Country into g`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("q"),
          Token.Operator.Assignment,
          Token.Operator.Query.From,
          Token.Identifier.RangeVariableName("c"),
          Token.Operator.Query.In,
          Token.Variable.ReadWrite("customers"),
          Token.Operator.Query.Group,
          Token.Variable.ReadWrite("c"),
          Token.Operator.Query.By,
          Token.Variable.Object("c"),
          Token.Punctuation.Accessor,
          Token.Variable.Property("Country"),
          Token.Operator.Query.Into,
          Token.Identifier.RangeVariableName("g")
        ]);
      });

      it("parenthesized", async () => {
        const input = Input.InMethod(`
var q = (from x in "abc" select x);
string s;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("q"),
          Token.Operator.Assignment,
          Token.Punctuation.OpenParen,
          Token.Operator.Query.From,
          Token.Identifier.RangeVariableName("x"),
          Token.Operator.Query.In,
          Token.Punctuation.String.Begin,
          Token.Literal.String("abc"),
          Token.Punctuation.String.End,
          Token.Operator.Query.Select,
          Token.Variable.ReadWrite("x"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
          Token.PrimitiveType.String,
          Token.Identifier.LocalName("s"),
          Token.Punctuation.Semicolon
        ]);
      });

      it("highlight complex query properly (issue omnisharp-vscode#1106)", async () => {
        const input = Input.InClass(`
private static readonly Parser<Node> NodeParser =
    from name in NodeName.Token()
    from type in NodeValueType.Token()
    from eq in Parse.Char('=')
    from value in QuotedString.Token()
    from lcurl in Parse.Char('{').Token()
    from children in Parse.Ref(() => ChildrenNodesParser)
    from rcurl in Parse.Char('}').Token()
    select new Node
        {
            Name = name,
            Type = type,
            Value = value,
            Children = children
        };
`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Modifier.Private,
          Token.Keyword.Modifier.Static,
          Token.Keyword.Modifier.ReadOnly,
          Token.Type("Parser"),
          Token.Punctuation.TypeParameter.Begin,
          Token.Type("Node"),
          Token.Punctuation.TypeParameter.End,
          Token.Identifier.FieldName("NodeParser"),
          Token.Operator.Assignment,

          // from name in NodeName.Token()
          Token.Operator.Query.From,
          Token.Identifier.RangeVariableName("name"),
          Token.Operator.Query.In,
          Token.Variable.Object("NodeName"),
          Token.Punctuation.Accessor,
          Token.Identifier.MethodName("Token"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,

          // from type in NodeValueType.Token()
          Token.Operator.Query.From,
          Token.Identifier.RangeVariableName("type"),
          Token.Operator.Query.In,
          Token.Variable.Object("NodeValueType"),
          Token.Punctuation.Accessor,
          Token.Identifier.MethodName("Token"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,

          // from eq in Parse.Char('=')
          Token.Operator.Query.From,
          Token.Identifier.RangeVariableName("eq"),
          Token.Operator.Query.In,
          Token.Variable.Object("Parse"),
          Token.Punctuation.Accessor,
          Token.Identifier.MethodName("Char"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.Char.Begin,
          Token.Literal.Char("="),
          Token.Punctuation.Char.End,
          Token.Punctuation.CloseParen,

          // from value in QuotedString.Token()
          Token.Operator.Query.From,
          Token.Identifier.RangeVariableName("value"),
          Token.Operator.Query.In,
          Token.Variable.Object("QuotedString"),
          Token.Punctuation.Accessor,
          Token.Identifier.MethodName("Token"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,

          // from lcurl in Parse.Char('{').Token()
          Token.Operator.Query.From,
          Token.Identifier.RangeVariableName("lcurl"),
          Token.Operator.Query.In,
          Token.Variable.Object("Parse"),
          Token.Punctuation.Accessor,
          Token.Identifier.MethodName("Char"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.Char.Begin,
          Token.Literal.Char("{"),
          Token.Punctuation.Char.End,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Accessor,
          Token.Identifier.MethodName("Token"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,

          // from children in Parse.Ref(() => ChildrenNodesParser)
          Token.Operator.Query.From,
          Token.Identifier.RangeVariableName("children"),
          Token.Operator.Query.In,
          Token.Variable.Object("Parse"),
          Token.Punctuation.Accessor,
          Token.Identifier.MethodName("Ref"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Operator.Arrow,
          Token.Variable.ReadWrite("ChildrenNodesParser"),
          Token.Punctuation.CloseParen,

          // from rcurl in Parse.Char('}').Token()
          Token.Operator.Query.From,
          Token.Identifier.RangeVariableName("rcurl"),
          Token.Operator.Query.In,
          Token.Variable.Object("Parse"),
          Token.Punctuation.Accessor,
          Token.Identifier.MethodName("Char"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.Char.Begin,
          Token.Literal.Char("}"),
          Token.Punctuation.Char.End,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Accessor,
          Token.Identifier.MethodName("Token"),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,

          // select new Node
          // {
          //     Name = name,
          //     Type = type,
          //     Value = value,
          //     Children = children
          // };
          Token.Operator.Query.Select,
          Token.Operator.Expression.New,
          Token.Type("Node"),
          Token.Punctuation.OpenBrace,
          Token.Variable.ReadWrite("Name"),
          Token.Operator.Assignment,
          Token.Variable.ReadWrite("name"),
          Token.Punctuation.Comma,
          Token.Variable.ReadWrite("Type"),
          Token.Operator.Assignment,
          Token.Variable.ReadWrite("type"),
          Token.Punctuation.Comma,
          Token.Variable.ReadWrite("Value"),
          Token.Operator.Assignment,
          Token.Variable.Value,
          Token.Punctuation.Comma,
          Token.Variable.ReadWrite("Children"),
          Token.Operator.Assignment,
          Token.Variable.ReadWrite("children"),
          Token.Punctuation.CloseBrace,
          Token.Punctuation.Semicolon
        ]);
      });

      it("query join with anonymous type (issue #89)", async () => {
        const input = Input.InMethod(`
var q = from x in list1
join y in list2
    on new
    {
        x.Key1,
        x.Key2
    }
    equals new
    {
        y.Key1,
        y.Key2
    }
select x.Key1;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("q"),
          Token.Operator.Assignment,
          Token.Operator.Query.From,
          Token.Identifier.RangeVariableName("x"),
          Token.Operator.Query.In,
          Token.Variable.ReadWrite("list1"),
          Token.Operator.Query.Join,
          Token.Identifier.RangeVariableName("y"),
          Token.Operator.Query.In,
          Token.Variable.ReadWrite("list2"),
          Token.Operator.Query.On,
          Token.Operator.Expression.New,
          Token.Punctuation.OpenBrace,
          Token.Variable.Object("x"),
          Token.Punctuation.Accessor,
          Token.Variable.Property("Key1"),
          Token.Punctuation.Comma,
          Token.Variable.Object("x"),
          Token.Punctuation.Accessor,
          Token.Variable.Property("Key2"),
          Token.Punctuation.CloseBrace,
          Token.Operator.Query.Equals,
          Token.Operator.Expression.New,
          Token.Punctuation.OpenBrace,
          Token.Variable.Object("y"),
          Token.Punctuation.Accessor,
          Token.Variable.Property("Key1"),
          Token.Punctuation.Comma,
          Token.Variable.Object("y"),
          Token.Punctuation.Accessor,
          Token.Variable.Property("Key2"),
          Token.Punctuation.CloseBrace,
          Token.Operator.Query.Select,
          Token.Variable.Object("x"),
          Token.Punctuation.Accessor,
          Token.Variable.Property("Key1"),
          Token.Punctuation.Semicolon
        ]);
      });
    });

    describe("Throw expressions", () => {
      it("throw expression in expression-bodied member (issue #69)", async () => {
        const input = Input.InClass(
          `public static void A(string str) => throw new Exception(str);`
        );
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Modifier.Public,
          Token.Keyword.Modifier.Static,
          Token.PrimitiveType.Void,
          Token.Identifier.MethodName("A"),
          Token.Punctuation.OpenParen,
          Token.PrimitiveType.String,
          Token.Identifier.ParameterName("str"),
          Token.Punctuation.CloseParen,
          Token.Operator.Arrow,
          Token.Keyword.Flow.Throw,
          Token.Operator.Expression.New,
          Token.Type("Exception"),
          Token.Punctuation.OpenParen,
          Token.Variable.ReadWrite("str"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });

      it("throw expression in assignment", async () => {
        const input = Input.InMethod(
          `_field = field ?? throw new ArgumentNullException(nameof(field));`
        );
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Variable.ReadWrite("_field"),
          Token.Operator.Assignment,
          Token.Variable.ReadWrite("field"),
          Token.Operator.NullCoalescing,
          Token.Keyword.Flow.Throw,
          Token.Operator.Expression.New,
          Token.Type("ArgumentNullException"),
          Token.Punctuation.OpenParen,
          Token.Operator.Expression.NameOf,
          Token.Punctuation.OpenParen,
          Token.Variable.ReadWrite("field"),
          Token.Punctuation.CloseParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon
        ]);
      });
    });

    describe("With expression", () => {
      it("single line", async () => {
        const input = Input.InMethod(`var p2 = p1 with { X = 5 };`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("p2"),
          Token.Operator.Assignment,
          Token.Variable.ReadWrite("p1"),
          Token.Operator.Expression.With,
          Token.Punctuation.OpenBrace,
          Token.Variable.ReadWrite("X"),
          Token.Operator.Assignment,
          Token.Literal.Numeric.Decimal("5"),
          Token.Punctuation.CloseBrace,
          Token.Punctuation.Semicolon,
        ]);
      });

      it("multiple lines", async () => {
        const input = Input.InMethod(`
var p2 = p1 with
{
  X = 5, // comment
  Y = new List<int> { 0, 1 }
};`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("p2"),
          Token.Operator.Assignment,
          Token.Variable.ReadWrite("p1"),
          Token.Operator.Expression.With,
          Token.Punctuation.OpenBrace,
          Token.Variable.ReadWrite("X"),
          Token.Operator.Assignment,
          Token.Literal.Numeric.Decimal("5"),
          Token.Punctuation.Comma,
          Token.Comment.SingleLine.Start,
          Token.Comment.SingleLine.Text(" comment"),
          Token.Variable.ReadWrite("Y"),
          Token.Operator.Assignment,
          Token.Operator.Expression.New,
          Token.Type("List"),
          Token.Punctuation.TypeParameter.Begin,
          Token.PrimitiveType.Int,
          Token.Punctuation.TypeParameter.End,
          Token.Punctuation.OpenBrace,
          Token.Literal.Numeric.Decimal("0"),
          Token.Punctuation.Comma,
          Token.Literal.Numeric.Decimal("1"),
          Token.Punctuation.CloseBrace,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.Semicolon,
        ]);
      });

      it("comment before initializer (issue #264)", async () => {
        const input = Input.InMethod(`
var p2 = p1 with // comment
{
  X = 5
};`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keyword.Definition.Var,
          Token.Identifier.LocalName("p2"),
          Token.Operator.Assignment,
          Token.Variable.ReadWrite("p1"),
          Token.Operator.Expression.With,
          Token.Comment.SingleLine.Start,
          Token.Comment.SingleLine.Text(" comment"),
          Token.Punctuation.OpenBrace,
          Token.Variable.ReadWrite("X"),
          Token.Operator.Assignment,
          Token.Literal.Numeric.Decimal("5"),
          Token.Punctuation.CloseBrace,
          Token.Punctuation.Semicolon,
        ]);
      });
    });
  });
});
