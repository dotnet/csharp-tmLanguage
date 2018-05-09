/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe("Grammar", () => {
    before(() => { should(); });

    describe("Expressions", () => {
        describe("Object creation", () => {
            it("with argument multiplication (issue #82)", () => {
                const input = Input.InMethod(`
var newPoint = new Vector(point.x * z, 0);`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("newPoint"),
                    Token.Operators.Assignment,
                    Token.Keywords.New,
                    Token.Type("Vector"),
                    Token.Punctuation.OpenParen,
                    Token.Variables.Object("point"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("x"),
                    Token.Operators.Arithmetic.Multiplication,
                    Token.Variables.ReadWrite("z"),
                    Token.Punctuation.Comma,
                    Token.Literals.Numeric.Decimal("0"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });
        });

        describe("Anonymous Methods", () => {
            it("lambda expression with no parameters (assignment)", () => {
                const input = Input.InMethod(`Action a = () => { };`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Type("Action"),
                    Token.Identifiers.LocalName("a"),
                    Token.Operators.Assignment,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Operators.Arrow,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("lambda expression with single parameter (assignment)", () => {
                const input = Input.InMethod(`Action<int> a = x => { };`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Type("Action"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.PrimitiveType.Int,
                    Token.Punctuation.TypeParameters.End,
                    Token.Identifiers.LocalName("a"),
                    Token.Operators.Assignment,
                    Token.Identifiers.ParameterName("x"),
                    Token.Operators.Arrow,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("lambda expression with single parenthesized parameter (assignment)", () => {
                const input = Input.InMethod(`Action<int> a = (x) => { };`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Type("Action"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.PrimitiveType.Int,
                    Token.Punctuation.TypeParameters.End,
                    Token.Identifiers.LocalName("a"),
                    Token.Operators.Assignment,
                    Token.Punctuation.OpenParen,
                    Token.Identifiers.ParameterName("x"),
                    Token.Punctuation.CloseParen,
                    Token.Operators.Arrow,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("lambda expression with single typed parameter (assignment)", () => {
                const input = Input.InMethod(`Action<int> a = (int x) => { };`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Type("Action"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.PrimitiveType.Int,
                    Token.Punctuation.TypeParameters.End,
                    Token.Identifiers.LocalName("a"),
                    Token.Operators.Assignment,
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.Int,
                    Token.Identifiers.ParameterName("x"),
                    Token.Punctuation.CloseParen,
                    Token.Operators.Arrow,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("lambda expression with multiple parameters (assignment)", () => {
                const input = Input.InMethod(`Action<int, int> a = (x, y) => { };`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Type("Action"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.PrimitiveType.Int,
                    Token.Punctuation.Comma,
                    Token.PrimitiveType.Int,
                    Token.Punctuation.TypeParameters.End,
                    Token.Identifiers.LocalName("a"),
                    Token.Operators.Assignment,
                    Token.Punctuation.OpenParen,
                    Token.Identifiers.ParameterName("x"),
                    Token.Punctuation.Comma,
                    Token.Identifiers.ParameterName("y"),
                    Token.Punctuation.CloseParen,
                    Token.Operators.Arrow,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("lambda expression with multiple typed parameters (assignment)", () => {
                const input = Input.InMethod(`Action<int, int> a = (int x, int y) => { };`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Type("Action"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.PrimitiveType.Int,
                    Token.Punctuation.Comma,
                    Token.PrimitiveType.Int,
                    Token.Punctuation.TypeParameters.End,
                    Token.Identifiers.LocalName("a"),
                    Token.Operators.Assignment,
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.Int,
                    Token.Identifiers.ParameterName("x"),
                    Token.Punctuation.Comma,
                    Token.PrimitiveType.Int,
                    Token.Identifiers.ParameterName("y"),
                    Token.Punctuation.CloseParen,
                    Token.Operators.Arrow,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("async lambda expression with no parameters (assignment)", () => {
                const input = Input.InMethod(`Func<Task> a = async () => { };`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Type("Func"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.Type("Task"),
                    Token.Punctuation.TypeParameters.End,
                    Token.Identifiers.LocalName("a"),
                    Token.Operators.Assignment,
                    Token.Keywords.Modifiers.Async,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Operators.Arrow,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("async lambda expression with single parameter (assignment)", () => {
                const input = Input.InMethod(`Func<int, Task> a = async x => { };`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Type("Func"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.PrimitiveType.Int,
                    Token.Punctuation.Comma,
                    Token.Type("Task"),
                    Token.Punctuation.TypeParameters.End,
                    Token.Identifiers.LocalName("a"),
                    Token.Operators.Assignment,
                    Token.Keywords.Modifiers.Async,
                    Token.Identifiers.ParameterName("x"),
                    Token.Operators.Arrow,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("async lambda expression with single parenthesized parameter (assignment)", () => {
                const input = Input.InMethod(`Func<int, Task> a = async (x) => { };`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Type("Func"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.PrimitiveType.Int,
                    Token.Punctuation.Comma,
                    Token.Type("Task"),
                    Token.Punctuation.TypeParameters.End,
                    Token.Identifiers.LocalName("a"),
                    Token.Operators.Assignment,
                    Token.Keywords.Modifiers.Async,
                    Token.Punctuation.OpenParen,
                    Token.Identifiers.ParameterName("x"),
                    Token.Punctuation.CloseParen,
                    Token.Operators.Arrow,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("async lambda expression with single typed parameter (assignment)", () => {
                const input = Input.InMethod(`Func<int, Task> a = async (int x) => { };`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Type("Func"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.PrimitiveType.Int,
                    Token.Punctuation.Comma,
                    Token.Type("Task"),
                    Token.Punctuation.TypeParameters.End,
                    Token.Identifiers.LocalName("a"),
                    Token.Operators.Assignment,
                    Token.Keywords.Modifiers.Async,
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.Int,
                    Token.Identifiers.ParameterName("x"),
                    Token.Punctuation.CloseParen,
                    Token.Operators.Arrow,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("async lambda expression with multiple typed parameters (assignment)", () => {
                const input = Input.InMethod(`Func<int, int, Task> a = async (int x, int y) => { };`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Type("Func"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.PrimitiveType.Int,
                    Token.Punctuation.Comma,
                    Token.PrimitiveType.Int,
                    Token.Punctuation.Comma,
                    Token.Type("Task"),
                    Token.Punctuation.TypeParameters.End,
                    Token.Identifiers.LocalName("a"),
                    Token.Operators.Assignment,
                    Token.Keywords.Modifiers.Async,
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.Int,
                    Token.Identifiers.ParameterName("x"),
                    Token.Punctuation.Comma,
                    Token.PrimitiveType.Int,
                    Token.Identifiers.ParameterName("y"),
                    Token.Punctuation.CloseParen,
                    Token.Operators.Arrow,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("async lambda expression with multiple parameters (assignment)", () => {
                const input = Input.InMethod(`Func<int, int, Task> a = async (x, y) => { };`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Type("Func"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.PrimitiveType.Int,
                    Token.Punctuation.Comma,
                    Token.PrimitiveType.Int,
                    Token.Punctuation.Comma,
                    Token.Type("Task"),
                    Token.Punctuation.TypeParameters.End,
                    Token.Identifiers.LocalName("a"),
                    Token.Operators.Assignment,
                    Token.Keywords.Modifiers.Async,
                    Token.Punctuation.OpenParen,
                    Token.Identifiers.ParameterName("x"),
                    Token.Punctuation.Comma,
                    Token.Identifiers.ParameterName("y"),
                    Token.Punctuation.CloseParen,
                    Token.Operators.Arrow,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("anonymous method with no parameter list (assignment)", () => {
                const input = Input.InMethod(`Action a = delegate { };`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Type("Action"),
                    Token.Identifiers.LocalName("a"),
                    Token.Operators.Assignment,
                    Token.Keywords.Delegate,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("anonymous method with empty parameter list (assignment)", () => {
                const input = Input.InMethod(`Action a = delegate() { };`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Type("Action"),
                    Token.Identifiers.LocalName("a"),
                    Token.Operators.Assignment,
                    Token.Keywords.Delegate,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("anonymous method with parameters (assignment)", () => {
                const input = Input.InMethod(`Action a = delegate(int x, int y) { };`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Type("Action"),
                    Token.Identifiers.LocalName("a"),
                    Token.Operators.Assignment,
                    Token.Keywords.Delegate,
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.Int,
                    Token.Identifiers.ParameterName("x"),
                    Token.Punctuation.Comma,
                    Token.PrimitiveType.Int,
                    Token.Identifiers.ParameterName("y"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("async anonymous method with no parameter list (assignment)", () => {
                const input = Input.InMethod(`Func<Task> a = async delegate { };`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Type("Func"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.Type("Task"),
                    Token.Punctuation.TypeParameters.End,
                    Token.Identifiers.LocalName("a"),
                    Token.Operators.Assignment,
                    Token.Keywords.Modifiers.Async,
                    Token.Keywords.Delegate,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("async anonymous method with empty parameter list (assignment)", () => {
                const input = Input.InMethod(`Func<Task> a = async delegate() { };`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Type("Func"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.Type("Task"),
                    Token.Punctuation.TypeParameters.End,
                    Token.Identifiers.LocalName("a"),
                    Token.Operators.Assignment,
                    Token.Keywords.Modifiers.Async,
                    Token.Keywords.Delegate,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("async anonymous method with parameters (assignment)", () => {
                const input = Input.InMethod(`Func<Task> a = async delegate(int x, int y) { };`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Type("Func"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.Type("Task"),
                    Token.Punctuation.TypeParameters.End,
                    Token.Identifiers.LocalName("a"),
                    Token.Operators.Assignment,
                    Token.Keywords.Modifiers.Async,
                    Token.Keywords.Delegate,
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.Int,
                    Token.Identifiers.ParameterName("x"),
                    Token.Punctuation.Comma,
                    Token.PrimitiveType.Int,
                    Token.Identifiers.ParameterName("y"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("lambda expression with no parameters (passed as argument)", () => {
                const input = Input.InMethod(`M(() => { });`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Operators.Arrow,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("lambda expression with single parameter (passed as argument)", () => {
                const input = Input.InMethod(`M(x => { });`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Identifiers.ParameterName("x"),
                    Token.Operators.Arrow,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("lambda expression with single parenthesized parameter (passed as argument)", () => {
                const input = Input.InMethod(`M((x) => { });`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.OpenParen,
                    Token.Identifiers.ParameterName("x"),
                    Token.Punctuation.CloseParen,
                    Token.Operators.Arrow,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("lambda expression with single typed parameter (passed as argument)", () => {
                const input = Input.InMethod(`M((int x) => { });`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.Int,
                    Token.Identifiers.ParameterName("x"),
                    Token.Punctuation.CloseParen,
                    Token.Operators.Arrow,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("lambda expression with multiple parameters (passed as argument)", () => {
                const input = Input.InMethod(`M((x, y) => { });`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.OpenParen,
                    Token.Identifiers.ParameterName("x"),
                    Token.Punctuation.Comma,
                    Token.Identifiers.ParameterName("y"),
                    Token.Punctuation.CloseParen,
                    Token.Operators.Arrow,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("lambda expression with multiple typed parameters (passed as argument)", () => {
                const input = Input.InMethod(`M((int x, int y) => { });`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.Int,
                    Token.Identifiers.ParameterName("x"),
                    Token.Punctuation.Comma,
                    Token.PrimitiveType.Int,
                    Token.Identifiers.ParameterName("y"),
                    Token.Punctuation.CloseParen,
                    Token.Operators.Arrow,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("async lambda expression with no parameters (passed as argument)", () => {
                const input = Input.InMethod(`M(async () => { });`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Keywords.Modifiers.Async,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Operators.Arrow,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("async lambda expression with single parameter (passed as argument)", () => {
                const input = Input.InMethod(`M(async x => { });`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Keywords.Modifiers.Async,
                    Token.Identifiers.ParameterName("x"),
                    Token.Operators.Arrow,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("async lambda expression with single parenthesized parameter (passed as argument)", () => {
                const input = Input.InMethod(`M(async (x) => { });`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Keywords.Modifiers.Async,
                    Token.Punctuation.OpenParen,
                    Token.Identifiers.ParameterName("x"),
                    Token.Punctuation.CloseParen,
                    Token.Operators.Arrow,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("async lambda expression with single typed parameter (passed as argument)", () => {
                const input = Input.InMethod(`M(async (int x) => { });`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Keywords.Modifiers.Async,
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.Int,
                    Token.Identifiers.ParameterName("x"),
                    Token.Punctuation.CloseParen,
                    Token.Operators.Arrow,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("async lambda expression with multiple parameters (passed as argument)", () => {
                const input = Input.InMethod(`M(async (x, y) => { });`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Keywords.Modifiers.Async,
                    Token.Punctuation.OpenParen,
                    Token.Identifiers.ParameterName("x"),
                    Token.Punctuation.Comma,
                    Token.Identifiers.ParameterName("y"),
                    Token.Punctuation.CloseParen,
                    Token.Operators.Arrow,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("async lambda expression with multiple typed parameters (passed as argument)", () => {
                const input = Input.InMethod(`M(async (int x, int y) => { });`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Keywords.Modifiers.Async,
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.Int,
                    Token.Identifiers.ParameterName("x"),
                    Token.Punctuation.Comma,
                    Token.PrimitiveType.Int,
                    Token.Identifiers.ParameterName("y"),
                    Token.Punctuation.CloseParen,
                    Token.Operators.Arrow,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("lambda expression with ref return", () => {
                const input = Input.InMethod(`M((ref int x) => ref x);`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.OpenParen,
                    Token.Keywords.Modifiers.Ref,
                    Token.PrimitiveType.Int,
                    Token.Identifiers.ParameterName("x"),
                    Token.Punctuation.CloseParen,
                    Token.Operators.Arrow,
                    Token.Keywords.Modifiers.Ref,
                    Token.Variables.ReadWrite("x"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("anonymous method with no parameter list (passed as argument)", () => {
                const input = Input.InMethod(`M(delegate { });`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Keywords.Delegate,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("anonymous method with empty parameter list (passed as argument)", () => {
                const input = Input.InMethod(`M(delegate() { });`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Keywords.Delegate,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("anonymous method with parameters (passed as argument)", () => {
                const input = Input.InMethod(`M(delegate(int x, int y) { });`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Keywords.Delegate,
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.Int,
                    Token.Identifiers.ParameterName("x"),
                    Token.Punctuation.Comma,
                    Token.PrimitiveType.Int,
                    Token.Identifiers.ParameterName("y"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("async anonymous method with no parameter list (passed as argument)", () => {
                const input = Input.InMethod(`M(async delegate { });`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Keywords.Modifiers.Async,
                    Token.Keywords.Delegate,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("async anonymous method with empty parameter list (passed as argument)", () => {
                const input = Input.InMethod(`M(async delegate() { });`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Keywords.Modifiers.Async,
                    Token.Keywords.Delegate,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("async anonymous method with parameters (passed as argument)", () => {
                const input = Input.InMethod(`M(async delegate(int x, int y) { });`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Keywords.Modifiers.Async,
                    Token.Keywords.Delegate,
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.Int,
                    Token.Identifiers.ParameterName("x"),
                    Token.Punctuation.Comma,
                    Token.PrimitiveType.Int,
                    Token.Identifiers.ParameterName("y"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("lambda expression with throw statement passed as argument (issue #90)", () => {
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
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Punctuation.OpenBracket,
                    Token.Type("Fact"),
                    Token.Punctuation.CloseBracket,
                    Token.Keywords.Modifiers.Public,
                    Token.PrimitiveType.Void,
                    Token.Identifiers.MethodName("Method1"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,

                    // app.Command(_ => throw new InvalidOperationException());
                    Token.Variables.Object("app"),
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("Command"),
                    Token.Punctuation.OpenParen,
                    Token.Identifiers.ParameterName("_"),
                    Token.Operators.Arrow,
                    Token.Keywords.Control.Throw,
                    Token.Keywords.New,
                    Token.Type("InvalidOperationException"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon,

                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.OpenBracket,
                    Token.Type("Fact"),
                    Token.Punctuation.CloseBracket,
                    Token.Keywords.Modifiers.Public,
                    Token.PrimitiveType.Void,
                    Token.Identifiers.MethodName("Method2"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,

                    // app.Command()
                    Token.Variables.Object("app"),
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("Command"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.CloseBrace,
                ]);
            });

            it("lambda expression with parameter whose name starts with ref (issue #95)", () => {
                const input = Input.InMethod(`
var refObjectsToKeep = allRefObjects.Where(refObject => refObject.ShouldKeep);
var intObjectsToKeep = allIntObjects.Where(intObject => intObject.ShouldKeep);
var outObjectsToKeep = allOutObjects.Where(outObject => outObject.ShouldKeep);`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    // var refObjectsToKeep = allRefObjects.Where(refObject => refObject.ShouldKeep);
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("refObjectsToKeep"),
                    Token.Operators.Assignment,
                    Token.Variables.Object("allRefObjects"),
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("Where"),
                    Token.Punctuation.OpenParen,
                    Token.Identifiers.ParameterName("refObject"),
                    Token.Operators.Arrow,
                    Token.Variables.Object("refObject"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("ShouldKeep"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon,

                    // var intObjectsToKeep = allIntObjects.Where(intObject => intObject.ShouldKeep);
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("intObjectsToKeep"),
                    Token.Operators.Assignment,
                    Token.Variables.Object("allIntObjects"),
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("Where"),
                    Token.Punctuation.OpenParen,
                    Token.Identifiers.ParameterName("intObject"),
                    Token.Operators.Arrow,
                    Token.Variables.Object("intObject"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("ShouldKeep"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon,

                    // var outObjectsToKeep = allOutObjects.Where(outObject => outObject.ShouldKeep);;
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("outObjectsToKeep"),
                    Token.Operators.Assignment,
                    Token.Variables.Object("allOutObjects"),
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("Where"),
                    Token.Punctuation.OpenParen,
                    Token.Identifiers.ParameterName("outObject"),
                    Token.Operators.Arrow,
                    Token.Variables.Object("outObject"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("ShouldKeep"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon,
                ]);
            });
        });

        describe("Anonymous Objects", () => {
            it("simple - on single line", () => {
                const input = Input.InMethod(`var x = new { ID = 42 };`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("x"),
                    Token.Operators.Assignment,
                    Token.Keywords.New,
                    Token.Punctuation.OpenBrace,
                    Token.Variables.ReadWrite("ID"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Decimal("42"),
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("simple - on multiple lines", () => {
                const input = Input.InMethod(`
var x = new
{
    ID = 42
};`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("x"),
                    Token.Operators.Assignment,
                    Token.Keywords.New,
                    Token.Punctuation.OpenBrace,
                    Token.Variables.ReadWrite("ID"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Decimal("42"),
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("nested - on single line", () => {
                const input = Input.InMethod(`var x = new { y = new { ID = 42 } };`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("x"),
                    Token.Operators.Assignment,
                    Token.Keywords.New,
                    Token.Punctuation.OpenBrace,
                    Token.Variables.ReadWrite("y"),
                    Token.Operators.Assignment,
                    Token.Keywords.New,
                    Token.Punctuation.OpenBrace,
                    Token.Variables.ReadWrite("ID"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Decimal("42"),
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("nested - on multiple lines", () => {
                const input = Input.InMethod(`
var x = new
{
    y = new
    {
        ID = 42
    }
};`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("x"),
                    Token.Operators.Assignment,
                    Token.Keywords.New,
                    Token.Punctuation.OpenBrace,
                    Token.Variables.ReadWrite("y"),
                    Token.Operators.Assignment,
                    Token.Keywords.New,
                    Token.Punctuation.OpenBrace,
                    Token.Variables.ReadWrite("ID"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Decimal("42"),
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.Semicolon
                ]);
            });
        });

        describe("Arithmetic", () => {
            it("mixed relational and arithmetic operators", () => {
                const input = Input.InMethod(`b = this.i != 1 + (2 - 3);`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Variables.ReadWrite("b"),
                    Token.Operators.Assignment,
                    Token.Keywords.This,
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("i"),
                    Token.Operators.Relational.NotEqual,
                    Token.Literals.Numeric.Decimal("1"),
                    Token.Operators.Arithmetic.Addition,
                    Token.Punctuation.OpenParen,
                    Token.Literals.Numeric.Decimal("2"),
                    Token.Operators.Arithmetic.Subtraction,
                    Token.Literals.Numeric.Decimal("3"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });
        });

        describe("Array Creation", () => {
            it("array creation expression passed as argument", () => {
                const input = Input.InMethod(`c.abst(ref s, new int[] {1, i, i});`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Variables.Object("c"),
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("abst"),
                    Token.Punctuation.OpenParen,
                    Token.Keywords.Modifiers.Ref,
                    Token.Variables.ReadWrite("s"),
                    Token.Punctuation.Comma,
                    Token.Keywords.New,
                    Token.PrimitiveType.Int,
                    Token.Punctuation.OpenBracket,
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.OpenBrace,
                    Token.Literals.Numeric.Decimal("1"),
                    Token.Punctuation.Comma,
                    Token.Variables.ReadWrite("i"),
                    Token.Punctuation.Comma,
                    Token.Variables.ReadWrite("i"),
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });
        });

        describe("Await", () => {
            it("at statement level", () => {
                const input = Input.InMethod(`await M();`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Await,
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("in assignment", () => {
                const input = Input.InMethod(`var x = await M();`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("x"),
                    Token.Operators.Assignment,
                    Token.Keywords.Await,
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("passed as argument", () => {
                const input = Input.InMethod(`M1(await M2());`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M1"),
                    Token.Punctuation.OpenParen,
                    Token.Keywords.Await,
                    Token.Identifiers.MethodName("M2"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("statement level (issue #83)", () => {
                const input = Input.InMethod(`await x;`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Await,
                    Token.Variables.ReadWrite("x"),
                    Token.Punctuation.Semicolon
                ]);
            });
        });

        describe("Casts", () => {
            it("cast to built-in type in assignment", () => {
                const input = Input.InMethod(`var o = (object)42;`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("o"),
                    Token.Operators.Assignment,
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.Object,
                    Token.Punctuation.CloseParen,
                    Token.Literals.Numeric.Decimal("42"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("cast to generic type in assignment", () => {
                const input = Input.InMethod(`var o = (C<int>)42;`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("o"),
                    Token.Operators.Assignment,
                    Token.Punctuation.OpenParen,
                    Token.Type("C"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.PrimitiveType.Int,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.CloseParen,
                    Token.Literals.Numeric.Decimal("42"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("cast to tuple type in assignment", () => {
                const input = Input.InMethod(`var t = ((int x, int y))o;`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("t"),
                    Token.Operators.Assignment,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.Int,
                    Token.Identifiers.TupleElementName("x"),
                    Token.Punctuation.Comma,
                    Token.PrimitiveType.Int,
                    Token.Identifiers.TupleElementName("y"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.CloseParen,
                    Token.Variables.ReadWrite("o"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("passed to invocation", () => {
                const input = Input.InMethod(`M((int)42);`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.Int,
                    Token.Punctuation.CloseParen,
                    Token.Literals.Numeric.Decimal("42"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("chained cast passed to invocation", () => {
                const input = Input.InMethod(`M((int)(object)42);`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.Int,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.Object,
                    Token.Punctuation.CloseParen,
                    Token.Literals.Numeric.Decimal("42"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("as cast of identifier", () => {
                const input = Input.InMethod(`var x = o as List<Lazy<string>>;`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("x"),
                    Token.Operators.Assignment,
                    Token.Variables.ReadWrite("o"),
                    Token.Keywords.As,
                    Token.Type("List"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.Type("Lazy"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.PrimitiveType.String,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("as cast of invocation", () => {
                const input = Input.InMethod(`var x = M() as List<Lazy<string>>;`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("x"),
                    Token.Operators.Assignment,
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Keywords.As,
                    Token.Type("List"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.Type("Lazy"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.PrimitiveType.String,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("is cast of identifier", () => {
                const input = Input.InMethod(`var x = o is List<Lazy<string>>;`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("x"),
                    Token.Operators.Assignment,
                    Token.Variables.ReadWrite("o"),
                    Token.Keywords.Is,
                    Token.Type("List"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.Type("Lazy"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.PrimitiveType.String,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("is cast of invocation", () => {
                const input = Input.InMethod(`var x = M() is List<Lazy<string>>;`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("x"),
                    Token.Operators.Assignment,
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Keywords.Is,
                    Token.Type("List"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.Type("Lazy"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.PrimitiveType.String,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.Semicolon
                ]);
            });
        });

        describe("Checked/Unchecked", () => {
            it("checked expression", () => {
                const input = Input.InMethod(`int x = checked(42);`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Int,
                    Token.Identifiers.LocalName("x"),
                    Token.Operators.Assignment,
                    Token.Keywords.Checked,
                    Token.Punctuation.OpenParen,
                    Token.Literals.Numeric.Decimal("42"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("unchecked expression", () => {
                const input = Input.InMethod(`int x = unchecked(42);`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Int,
                    Token.Identifiers.LocalName("x"),
                    Token.Operators.Assignment,
                    Token.Keywords.Unchecked,
                    Token.Punctuation.OpenParen,
                    Token.Literals.Numeric.Decimal("42"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("checked expression inside checked statement", () => {
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
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Class,
                    Token.Identifiers.ClassName("C"),
                    Token.Punctuation.OpenBrace,
                    Token.PrimitiveType.Void,
                    Token.Identifiers.MethodName("M1"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,

                    Token.Keywords.Checked,
                    Token.Punctuation.OpenBrace,
                    Token.Keywords.Checked,
                    Token.Punctuation.OpenParen,
                    Token.Operators.Increment,
                    Token.Variables.ReadWrite("i"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon,
                    Token.Punctuation.CloseBrace,

                    Token.Punctuation.CloseBrace,
                    Token.PrimitiveType.Void,
                    Token.Identifiers.MethodName("M2"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.CloseBrace
                ]);
            });
        });

        describe("Conditional Operator", () => {
            it("in assignment", () => {
                const input = Input.InMethod(`var y = x ? 19 : 23;`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("y"),
                    Token.Operators.Assignment,
                    Token.Variables.ReadWrite("x"),
                    Token.Operators.Conditional.QuestionMark,
                    Token.Literals.Numeric.Decimal("19"),
                    Token.Operators.Conditional.Colon,
                    Token.Literals.Numeric.Decimal("23"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("passed as argument", () => {
                const input = Input.InMethod(`M(x ? 19 : 23);`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Variables.ReadWrite("x"),
                    Token.Operators.Conditional.QuestionMark,
                    Token.Literals.Numeric.Decimal("19"),
                    Token.Operators.Conditional.Colon,
                    Token.Literals.Numeric.Decimal("23"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("in nested anonymous objects (issue #85)", () => {
                const input = Input.InMethod(`
var result = list.Select(l => new {
    w = l != null ? new {
        h = l.ToUpper()
    } : null
});`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    // var result = list.Select(l => new {
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("result"),
                    Token.Operators.Assignment,
                    Token.Variables.Object("list"),
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("Select"),
                    Token.Punctuation.OpenParen,
                    Token.Identifiers.ParameterName("l"),
                    Token.Operators.Arrow,
                    Token.Keywords.New,
                    Token.Punctuation.OpenBrace,

                    // w = l != null ? new {
                    Token.Variables.ReadWrite("w"),
                    Token.Operators.Assignment,
                    Token.Variables.ReadWrite("l"),
                    Token.Operators.Relational.NotEqual,
                    Token.Literals.Null,
                    Token.Operators.Conditional.QuestionMark,
                    Token.Keywords.New,
                    Token.Punctuation.OpenBrace,

                    // h = l.ToUpper()
                    Token.Variables.ReadWrite("h"),
                    Token.Operators.Assignment,
                    Token.Variables.Object("l"),
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("ToUpper"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,

                    // } : null
                    Token.Punctuation.CloseBrace,
                    Token.Operators.Conditional.Colon,
                    Token.Literals.Null,

                    // });
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });
        });

        describe("Element Access", () => {
            it("no arguments", () => {
                const input = Input.InMethod(`var o = P[];`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("o"),
                    Token.Operators.Assignment,
                    Token.Variables.Property("P"),
                    Token.Punctuation.OpenBracket,
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("one argument", () => {
                const input = Input.InMethod(`var o = P[42];`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("o"),
                    Token.Operators.Assignment,
                    Token.Variables.Property("P"),
                    Token.Punctuation.OpenBracket,
                    Token.Literals.Numeric.Decimal("42"),
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("two arguments", () => {
                const input = Input.InMethod(`var o = P[19, 23];`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("o"),
                    Token.Operators.Assignment,
                    Token.Variables.Property("P"),
                    Token.Punctuation.OpenBracket,
                    Token.Literals.Numeric.Decimal("19"),
                    Token.Punctuation.Comma,
                    Token.Literals.Numeric.Decimal("23"),
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("two named arguments", () => {
                const input = Input.InMethod(`var o = P[x: 19, y: 23];`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("o"),
                    Token.Operators.Assignment,
                    Token.Variables.Property("P"),
                    Token.Punctuation.OpenBracket,
                    Token.Identifiers.ParameterName("x"),
                    Token.Punctuation.Colon,
                    Token.Literals.Numeric.Decimal("19"),
                    Token.Punctuation.Comma,
                    Token.Identifiers.ParameterName("y"),
                    Token.Punctuation.Colon,
                    Token.Literals.Numeric.Decimal("23"),
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("ref argument", () => {
                const input = Input.InMethod(`var o = P[ref x];`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("o"),
                    Token.Operators.Assignment,
                    Token.Variables.Property("P"),
                    Token.Punctuation.OpenBracket,
                    Token.Keywords.Modifiers.Ref,
                    Token.Variables.ReadWrite("x"),
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("out argument", () => {
                const input = Input.InMethod(`var o = P[out x];`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("o"),
                    Token.Operators.Assignment,
                    Token.Variables.Property("P"),
                    Token.Punctuation.OpenBracket,
                    Token.Keywords.Modifiers.Out,
                    Token.Variables.ReadWrite("x"),
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("named ref argument", () => {
                const input = Input.InMethod(`var o = P[x: ref y];`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("o"),
                    Token.Operators.Assignment,
                    Token.Variables.Property("P"),
                    Token.Punctuation.OpenBracket,
                    Token.Identifiers.ParameterName("x"),
                    Token.Punctuation.Colon,
                    Token.Keywords.Modifiers.Ref,
                    Token.Variables.ReadWrite("y"),
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("named out argument", () => {
                const input = Input.InMethod(`var o = P[x: out y];`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("o"),
                    Token.Operators.Assignment,
                    Token.Variables.Property("P"),
                    Token.Punctuation.OpenBracket,
                    Token.Identifiers.ParameterName("x"),
                    Token.Punctuation.Colon,
                    Token.Keywords.Modifiers.Out,
                    Token.Variables.ReadWrite("y"),
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("out argument declaration", () => {
                const input = Input.InMethod(`var o = P[out int x, out var y];`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("o"),
                    Token.Operators.Assignment,
                    Token.Variables.Property("P"),
                    Token.Punctuation.OpenBracket,
                    Token.Keywords.Modifiers.Out,
                    Token.PrimitiveType.Int,
                    Token.Identifiers.LocalName("x"),
                    Token.Punctuation.Comma,
                    Token.Keywords.Modifiers.Out,
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("y"),
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("member of generic with no arguments", () => {
                const input = Input.InMethod(`var o = C<int>.P[];`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("o"),
                    Token.Operators.Assignment,
                    Token.Variables.Object("C"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.PrimitiveType.Int,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("P"),
                    Token.Punctuation.OpenBracket,
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("member of qualified generic with no arguments", () => {
                const input = Input.InMethod(`var o = N.C<int>.P[];`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("o"),
                    Token.Operators.Assignment,
                    Token.Variables.Object("N"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Object("C"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.PrimitiveType.Int,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("P"),
                    Token.Punctuation.OpenBracket,
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("member with element access", () => {
                const input = Input.InMethod(`var a = b.c[0];`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("a"),
                    Token.Operators.Assignment,
                    Token.Variables.Object("b"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("c"),
                    Token.Punctuation.OpenBracket,
                    Token.Literals.Numeric.Decimal("0"),
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("member with two element accesses", () => {
                const input = Input.InMethod(`var a = b.c[19][23];`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("a"),
                    Token.Operators.Assignment,
                    Token.Variables.Object("b"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("c"),
                    Token.Punctuation.OpenBracket,
                    Token.Literals.Numeric.Decimal("19"),
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.OpenBracket,
                    Token.Literals.Numeric.Decimal("23"),
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("member with two element accesses and another member", () => {
                const input = Input.InMethod(`var a = b.c[19][23].d;`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("a"),
                    Token.Operators.Assignment,
                    Token.Variables.Object("b"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("c"),
                    Token.Punctuation.OpenBracket,
                    Token.Literals.Numeric.Decimal("19"),
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.OpenBracket,
                    Token.Literals.Numeric.Decimal("23"),
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("d"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("member with two element accesses and an invocation", () => {
                const input = Input.InMethod(`var a = b.c[19][23].d();`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("a"),
                    Token.Operators.Assignment,
                    Token.Variables.Object("b"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("c"),
                    Token.Punctuation.OpenBracket,
                    Token.Literals.Numeric.Decimal("19"),
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.OpenBracket,
                    Token.Literals.Numeric.Decimal("23"),
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("d"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("read/write array element", () => {
                const input = Input.InMethod(`
object[] a1 = {(null), (this.a), c};
a1[1] = ((this.a)); a1[2] = (c); a1[1] = (i);
`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Object,
                    Token.Punctuation.OpenBracket,
                    Token.Punctuation.CloseBracket,
                    Token.Identifiers.LocalName("a1"),
                    Token.Operators.Assignment,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.OpenParen,
                    Token.Literals.Null,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Comma,
                    Token.Punctuation.OpenParen,
                    Token.Keywords.This,
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("a"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Comma,
                    Token.Variables.ReadWrite("c"),
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.Semicolon,

                    Token.Variables.Property("a1"),
                    Token.Punctuation.OpenBracket,
                    Token.Literals.Numeric.Decimal("1"),
                    Token.Punctuation.CloseBracket,
                    Token.Operators.Assignment,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.OpenParen,
                    Token.Keywords.This,
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("a"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon,
                    Token.Variables.Property("a1"),
                    Token.Punctuation.OpenBracket,
                    Token.Literals.Numeric.Decimal("2"),
                    Token.Punctuation.CloseBracket,
                    Token.Operators.Assignment,
                    Token.Punctuation.OpenParen,
                    Token.Variables.ReadWrite("c"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon,
                    Token.Variables.Property("a1"),
                    Token.Punctuation.OpenBracket,
                    Token.Literals.Numeric.Decimal("1"),
                    Token.Punctuation.CloseBracket,
                    Token.Operators.Assignment,
                    Token.Punctuation.OpenParen,
                    Token.Variables.ReadWrite("i"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon,
                ]);
            });

            it("arithmetic expression with multiple element accesses 1 (issue #37)", () => {
                const input = Input.InMethod(`
long total = data["bonusGame"]["win"].AsLong * data["bonusGame"]["betMult"].AsLong;
`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Long,
                    Token.Identifiers.LocalName("total"),
                    Token.Operators.Assignment,
                    Token.Variables.Property("data"),
                    Token.Punctuation.OpenBracket,
                    Token.Punctuation.String.Begin,
                    Token.Literals.String("bonusGame"),
                    Token.Punctuation.String.End,
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.OpenBracket,
                    Token.Punctuation.String.Begin,
                    Token.Literals.String("win"),
                    Token.Punctuation.String.End,
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("AsLong"),
                    Token.Operators.Arithmetic.Multiplication,
                    Token.Variables.Property("data"),
                    Token.Punctuation.OpenBracket,
                    Token.Punctuation.String.Begin,
                    Token.Literals.String("bonusGame"),
                    Token.Punctuation.String.End,
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.OpenBracket,
                    Token.Punctuation.String.Begin,
                    Token.Literals.String("betMult"),
                    Token.Punctuation.String.End,
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("AsLong"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("arithmetic expression with multiple element accesses 2 (issue #37)", () => {
                const input = Input.InMethod(`
total = data["bonusGame"]["win"].AsLong * data["bonusGame"]["betMult"].AsLong;
`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Variables.ReadWrite("total"),
                    Token.Operators.Assignment,
                    Token.Variables.Property("data"),
                    Token.Punctuation.OpenBracket,
                    Token.Punctuation.String.Begin,
                    Token.Literals.String("bonusGame"),
                    Token.Punctuation.String.End,
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.OpenBracket,
                    Token.Punctuation.String.Begin,
                    Token.Literals.String("win"),
                    Token.Punctuation.String.End,
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("AsLong"),
                    Token.Operators.Arithmetic.Multiplication,
                    Token.Variables.Property("data"),
                    Token.Punctuation.OpenBracket,
                    Token.Punctuation.String.Begin,
                    Token.Literals.String("bonusGame"),
                    Token.Punctuation.String.End,
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.OpenBracket,
                    Token.Punctuation.String.Begin,
                    Token.Literals.String("betMult"),
                    Token.Punctuation.String.End,
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("AsLong"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("arithmetic expression with multiple element accesses 3 (issue #37)", () => {
                const input = Input.InMethod(`
long total = (data["bonusGame"]["win"].AsLong) * data["bonusGame"]["betMult"].AsLong;
`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Long,
                    Token.Identifiers.LocalName("total"),
                    Token.Operators.Assignment,
                    Token.Punctuation.OpenParen,
                    Token.Variables.Property("data"),
                    Token.Punctuation.OpenBracket,
                    Token.Punctuation.String.Begin,
                    Token.Literals.String("bonusGame"),
                    Token.Punctuation.String.End,
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.OpenBracket,
                    Token.Punctuation.String.Begin,
                    Token.Literals.String("win"),
                    Token.Punctuation.String.End,
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("AsLong"),
                    Token.Punctuation.CloseParen,
                    Token.Operators.Arithmetic.Multiplication,
                    Token.Variables.Property("data"),
                    Token.Punctuation.OpenBracket,
                    Token.Punctuation.String.Begin,
                    Token.Literals.String("bonusGame"),
                    Token.Punctuation.String.End,
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.OpenBracket,
                    Token.Punctuation.String.Begin,
                    Token.Literals.String("betMult"),
                    Token.Punctuation.String.End,
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("AsLong"),
                    Token.Punctuation.Semicolon
                ]);
            });
        });

        describe("Invocations", () => {
            it("no arguments", () => {
                const input = Input.InMethod(`M();`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("no arguments with space (issue #54)", () => {
                const input = Input.InMethod(`M ();`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("one argument", () => {
                const input = Input.InMethod(`M(42);`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Literals.Numeric.Decimal("42"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("one argument with space (issue #54)", () => {
                const input = Input.InMethod(`M (42);`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Literals.Numeric.Decimal("42"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("two arguments", () => {
                const input = Input.InMethod(`M(19, 23);`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Literals.Numeric.Decimal("19"),
                    Token.Punctuation.Comma,
                    Token.Literals.Numeric.Decimal("23"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("two named arguments", () => {
                const input = Input.InMethod(`M(x: 19, y: 23);`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Identifiers.ParameterName("x"),
                    Token.Punctuation.Colon,
                    Token.Literals.Numeric.Decimal("19"),
                    Token.Punctuation.Comma,
                    Token.Identifiers.ParameterName("y"),
                    Token.Punctuation.Colon,
                    Token.Literals.Numeric.Decimal("23"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("ref argument", () => {
                const input = Input.InMethod(`M(ref x);`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Keywords.Modifiers.Ref,
                    Token.Variables.ReadWrite("x"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("out argument", () => {
                const input = Input.InMethod(`M(out x);`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Keywords.Modifiers.Out,
                    Token.Variables.ReadWrite("x"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("named ref argument", () => {
                const input = Input.InMethod(`M(x: ref y);`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Identifiers.ParameterName("x"),
                    Token.Punctuation.Colon,
                    Token.Keywords.Modifiers.Ref,
                    Token.Variables.ReadWrite("y"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("named out argument", () => {
                const input = Input.InMethod(`M(x: out y);`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Identifiers.ParameterName("x"),
                    Token.Punctuation.Colon,
                    Token.Keywords.Modifiers.Out,
                    Token.Variables.ReadWrite("y"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("out argument declaration", () => {
                const input = Input.InMethod(`M(out int x, out var y);`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Keywords.Modifiers.Out,
                    Token.PrimitiveType.Int,
                    Token.Identifiers.LocalName("x"),
                    Token.Punctuation.Comma,
                    Token.Keywords.Modifiers.Out,
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("y"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("generic with no arguments", () => {
                const input = Input.InMethod(`M<int>();`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.PrimitiveType.Int,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("nested generic with no arguments", () => {
                const input = Input.InMethod(`M<T<int>>();`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.Type("T"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.PrimitiveType.Int,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("double-nested generic with no arguments", () => {
                const input = Input.InMethod(`M<T<U<int>>>();`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.Type("T"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.Type("U"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.PrimitiveType.Int,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("member of generic with no arguments", () => {
                const input = Input.InMethod(`C<int>.M();`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Variables.Object("C"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.PrimitiveType.Int,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("member of qualified generic with no arguments", () => {
                const input = Input.InMethod(`N.C<int>.M();`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Variables.Object("N"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Object("C"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.PrimitiveType.Int,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("store result of member of qualified generic with no arguments", () => {
                const input = Input.InMethod(`var o = N.C<int>.M();`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("o"),
                    Token.Operators.Assignment,
                    Token.Variables.Object("N"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Object("C"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.PrimitiveType.Int,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("store result of qualified method with no arguments", () => {
                const input = Input.InMethod(`var o = N.C.M();`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("o"),
                    Token.Operators.Assignment,
                    Token.Variables.Object("N"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("C"),
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("qualified method with no arguments and space 1 (issue #54)", () => {
                const input = Input.InMethod(`N.C.M ();`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Variables.Object("N"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("C"),
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("qualified method with no arguments and space 2 (issue #54)", () => {
                const input = Input.InMethod(`C.M ();`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Variables.Object("C"),
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("store result of this.qualified method with no arguments", () => {
                const input = Input.InMethod(`var o = this.C.M();`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("o"),
                    Token.Operators.Assignment,
                    Token.Keywords.This,
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("C"),
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("store result of invocation with two named arguments", () => {
                const input = Input.InMethod(`var o = M(x: 19, y: 23);`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("o"),
                    Token.Operators.Assignment,
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Identifiers.ParameterName("x"),
                    Token.Punctuation.Colon,
                    Token.Literals.Numeric.Decimal("19"),
                    Token.Punctuation.Comma,
                    Token.Identifiers.ParameterName("y"),
                    Token.Punctuation.Colon,
                    Token.Literals.Numeric.Decimal("23"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("multiplicated parameters (issue #99)", () => {
                const input = Input.InMethod(`Multiply(n1 * n2);`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("Multiply"),
                    Token.Punctuation.OpenParen,
                    Token.Variables.ReadWrite("n1"),
                    Token.Operators.Arithmetic.Multiplication,
                    Token.Variables.ReadWrite("n2"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("chained method calls", () => {
                const input = Input.InMethod(`M1().M2();`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M1"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("M2"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("chained invocations with lambda expression arguments", () => {
                const input = Input.InMethod(`M1(x => x).M2(x => x);`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M1"),
                    Token.Punctuation.OpenParen,
                    Token.Identifiers.ParameterName("x"),
                    Token.Operators.Arrow,
                    Token.Variables.ReadWrite("x"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("M2"),
                    Token.Punctuation.OpenParen,
                    Token.Identifiers.ParameterName("x"),
                    Token.Operators.Arrow,
                    Token.Variables.ReadWrite("x"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("chained invocations with lambda expression arguments, each with single parenthesized parameter", () => {
                const input = Input.InMethod(`M1((x) => x).M2((x) => x);`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M1"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.OpenParen,
                    Token.Identifiers.ParameterName("x"),
                    Token.Punctuation.CloseParen,
                    Token.Operators.Arrow,
                    Token.Variables.ReadWrite("x"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("M2"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.OpenParen,
                    Token.Identifiers.ParameterName("x"),
                    Token.Punctuation.CloseParen,
                    Token.Operators.Arrow,
                    Token.Variables.ReadWrite("x"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("chained invocations with multiple lambda expression arguments", () => {
                const input = Input.InMethod(`M1(x => x, y => y).M2(x => x, y => y);`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M1"),
                    Token.Punctuation.OpenParen,
                    Token.Identifiers.ParameterName("x"),
                    Token.Operators.Arrow,
                    Token.Variables.ReadWrite("x"),
                    Token.Punctuation.Comma,
                    Token.Identifiers.ParameterName("y"),
                    Token.Operators.Arrow,
                    Token.Variables.ReadWrite("y"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("M2"),
                    Token.Punctuation.OpenParen,
                    Token.Identifiers.ParameterName("x"),
                    Token.Operators.Arrow,
                    Token.Variables.ReadWrite("x"),
                    Token.Punctuation.Comma,
                    Token.Identifiers.ParameterName("y"),
                    Token.Operators.Arrow,
                    Token.Variables.ReadWrite("y"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("chained invocations with multiple lambda expression arguments (with parenthesized parameters)", () => {
                const input = Input.InMethod(`M1((x) => x, (y) => y).M2((x) => x, (y) => y);`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M1"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.OpenParen,
                    Token.Identifiers.ParameterName("x"),
                    Token.Punctuation.CloseParen,
                    Token.Operators.Arrow,
                    Token.Variables.ReadWrite("x"),
                    Token.Punctuation.Comma,
                    Token.Punctuation.OpenParen,
                    Token.Identifiers.ParameterName("y"),
                    Token.Punctuation.CloseParen,
                    Token.Operators.Arrow,
                    Token.Variables.ReadWrite("y"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("M2"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.OpenParen,
                    Token.Identifiers.ParameterName("x"),
                    Token.Punctuation.CloseParen,
                    Token.Operators.Arrow,
                    Token.Variables.ReadWrite("x"),
                    Token.Punctuation.Comma,
                    Token.Punctuation.OpenParen,
                    Token.Identifiers.ParameterName("y"),
                    Token.Punctuation.CloseParen,
                    Token.Operators.Arrow,
                    Token.Variables.ReadWrite("y"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("multiple invocations with lambda expressions (issue #47)", () => {
                const input = Input.InClass(`
void CandleLightOffSecond(int index)
{
    DOTween.ToAlpha(() => FSItems[index].CandleSecond.startColor, (x) => FSItems[index].CandleSecond.startColor = x, 0f, 1f).OnComplete(() => DisableCandleFX(index));
    DOTween.ToAlpha(() => FSItems[index].CandleSecond.startColor, (x) => FSItems[index].CandleSecond.startColor = x, 0f, 1f);
}`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Void,
                    Token.Identifiers.MethodName("CandleLightOffSecond"),
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.Int,
                    Token.Identifiers.ParameterName("index"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,

                    Token.Variables.Object("DOTween"),
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("ToAlpha"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Operators.Arrow,
                    Token.Variables.Property("FSItems"),
                    Token.Punctuation.OpenBracket,
                    Token.Variables.ReadWrite("index"),
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("CandleSecond"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("startColor"),
                    Token.Punctuation.Comma,
                    Token.Punctuation.OpenParen,
                    Token.Identifiers.ParameterName("x"),
                    Token.Punctuation.CloseParen,
                    Token.Operators.Arrow,
                    Token.Variables.Property("FSItems"),
                    Token.Punctuation.OpenBracket,
                    Token.Variables.ReadWrite("index"),
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("CandleSecond"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("startColor"),
                    Token.Operators.Assignment,
                    Token.Variables.ReadWrite("x"),
                    Token.Punctuation.Comma,
                    Token.Literals.Numeric.Decimal("0f"),
                    Token.Punctuation.Comma,
                    Token.Literals.Numeric.Decimal("1f"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("OnComplete"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Operators.Arrow,
                    Token.Identifiers.MethodName("DisableCandleFX"),
                    Token.Punctuation.OpenParen,
                    Token.Variables.ReadWrite("index"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon,

                    Token.Variables.Object("DOTween"),
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("ToAlpha"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Operators.Arrow,
                    Token.Variables.Property("FSItems"),
                    Token.Punctuation.OpenBracket,
                    Token.Variables.ReadWrite("index"),
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("CandleSecond"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("startColor"),
                    Token.Punctuation.Comma,
                    Token.Punctuation.OpenParen,
                    Token.Identifiers.ParameterName("x"),
                    Token.Punctuation.CloseParen,
                    Token.Operators.Arrow,
                    Token.Variables.Property("FSItems"),
                    Token.Punctuation.OpenBracket,
                    Token.Variables.ReadWrite("index"),
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("CandleSecond"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("startColor"),
                    Token.Operators.Assignment,
                    Token.Variables.ReadWrite("x"),
                    Token.Punctuation.Comma,
                    Token.Literals.Numeric.Decimal("0f"),
                    Token.Punctuation.Comma,
                    Token.Literals.Numeric.Decimal("1f"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon,

                    Token.Punctuation.CloseBrace
                ]);
            });
        });

        describe("nameof", () => {
            it("in assignment", () => {
                const input = Input.InMethod(`const int x = nameof(x);`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Modifiers.Const,
                    Token.PrimitiveType.Int,
                    Token.Identifiers.LocalName("x"),
                    Token.Operators.Assignment,
                    Token.Keywords.NameOf,
                    Token.Punctuation.OpenParen,
                    Token.Variables.ReadWrite("x"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });
        });

        describe("Null-coalescing Operator", () => {
            it("in assignment", () => {
                const input = Input.InMethod(`var y = x ?? new object();`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("y"),
                    Token.Operators.Assignment,
                    Token.Variables.ReadWrite("x"),
                    Token.Operators.NullCoalescing,
                    Token.Keywords.New,
                    Token.PrimitiveType.Object,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("passed as argument", () => {
                const input = Input.InMethod(`M(x ?? new object());`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Variables.ReadWrite("x"),
                    Token.Operators.NullCoalescing,
                    Token.Keywords.New,
                    Token.PrimitiveType.Object,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });
        });

        describe("Null-conditional Operator", () => {
            it("before dot 1", () => {
                const input = Input.InMethod(`var a = b?.c;`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("a"),
                    Token.Operators.Assignment,
                    Token.Variables.Object("b"),
                    Token.Operators.NullConditional,
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("c"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("before dot 2", () => {
                const input = Input.InMethod(`var a = b.c?.d;`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("a"),
                    Token.Operators.Assignment,
                    Token.Variables.Object("b"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("c"),
                    Token.Operators.NullConditional,
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("d"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("in element access 1", () => {
                const input = Input.InMethod(`var a = b.c?[0];`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("a"),
                    Token.Operators.Assignment,
                    Token.Variables.Object("b"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("c"),
                    Token.Operators.NullConditional,
                    Token.Punctuation.OpenBracket,
                    Token.Literals.Numeric.Decimal("0"),
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("in element access 2", () => {
                const input = Input.InMethod(`var a = b.c?.d?[0];`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("a"),
                    Token.Operators.Assignment,
                    Token.Variables.Object("b"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("c"),
                    Token.Operators.NullConditional,
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("d"),
                    Token.Operators.NullConditional,
                    Token.Punctuation.OpenBracket,
                    Token.Literals.Numeric.Decimal("0"),
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("before element access", () => {
                const input = Input.InMethod(`var a = b.c[0];`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("a"),
                    Token.Operators.Assignment,
                    Token.Variables.Object("b"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("c"),
                    Token.Punctuation.OpenBracket,
                    Token.Literals.Numeric.Decimal("0"),
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("before invocation", () => {
                const input = Input.InMethod(`var a = b?.c());`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("a"),
                    Token.Operators.Assignment,
                    Token.Variables.Object("b"),
                    Token.Operators.NullConditional,
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("c"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });
        });

        describe("Primary", () => {
            it("default", () => {
                const input = Input.InMethod(`var t = default(List<>);`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("t"),
                    Token.Operators.Assignment,
                    Token.Keywords.Default,
                    Token.Punctuation.OpenParen,
                    Token.Type("List"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("typeof", () => {
                const input = Input.InMethod(`var t = typeof(List<>);`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("t"),
                    Token.Operators.Assignment,
                    Token.Keywords.TypeOf,
                    Token.Punctuation.OpenParen,
                    Token.Type("List"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });
        });

        describe("Queries", () => {
            it("from clause", () => {
                const input = Input.InMethod(`var q = from n in numbers`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("q"),
                    Token.Operators.Assignment,
                    Token.Keywords.Queries.From,
                    Token.Identifiers.RangeVariableName("n"),
                    Token.Keywords.Queries.In,
                    Token.Variables.ReadWrite("numbers")
                ]);
            });

            it("from clause with type", () => {
                const input = Input.InMethod(`var q = from int n in numbers`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("q"),
                    Token.Operators.Assignment,
                    Token.Keywords.Queries.From,
                    Token.PrimitiveType.Int,
                    Token.Identifiers.RangeVariableName("n"),
                    Token.Keywords.Queries.In,
                    Token.Variables.ReadWrite("numbers")
                ]);
            });

            it("from clause followed by from clause", () => {
                const input = Input.InMethod(`
var q = from x in list1
        from y in list2
`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("q"),
                    Token.Operators.Assignment,
                    Token.Keywords.Queries.From,
                    Token.Identifiers.RangeVariableName("x"),
                    Token.Keywords.Queries.In,
                    Token.Variables.ReadWrite("list1"),
                    Token.Keywords.Queries.From,
                    Token.Identifiers.RangeVariableName("y"),
                    Token.Keywords.Queries.In,
                    Token.Variables.ReadWrite("list2")
                ]);
            });

            it("from clause, join clause", () => {
                const input = Input.InMethod(`
var q = from c in customers
        join o in orders on c.CustomerID equals o.CustomerID
`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("q"),
                    Token.Operators.Assignment,
                    Token.Keywords.Queries.From,
                    Token.Identifiers.RangeVariableName("c"),
                    Token.Keywords.Queries.In,
                    Token.Variables.ReadWrite("customers"),
                    Token.Keywords.Queries.Join,
                    Token.Identifiers.RangeVariableName("o"),
                    Token.Keywords.Queries.In,
                    Token.Variables.ReadWrite("orders"),
                    Token.Keywords.Queries.On,
                    Token.Variables.Object("c"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("CustomerID"),
                    Token.Keywords.Queries.Equals,
                    Token.Variables.Object("o"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("CustomerID")
                ]);
            });

            it("from clause, join-into clause", () => {
                const input = Input.InMethod(`
var q = from c in customers
        join o in orders on c.CustomerID equals o.CustomerID into co
`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("q"),
                    Token.Operators.Assignment,
                    Token.Keywords.Queries.From,
                    Token.Identifiers.RangeVariableName("c"),
                    Token.Keywords.Queries.In,
                    Token.Variables.ReadWrite("customers"),
                    Token.Keywords.Queries.Join,
                    Token.Identifiers.RangeVariableName("o"),
                    Token.Keywords.Queries.In,
                    Token.Variables.ReadWrite("orders"),
                    Token.Keywords.Queries.On,
                    Token.Variables.Object("c"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("CustomerID"),
                    Token.Keywords.Queries.Equals,
                    Token.Variables.Object("o"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("CustomerID"),
                    Token.Keywords.Queries.Into,
                    Token.Identifiers.RangeVariableName("co")
                ]);
            });

            it("from clause, orderby", () => {
                const input = Input.InMethod(`
var q = from o in orders
        orderby o.Customer.Name, o.Total
`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("q"),
                    Token.Operators.Assignment,
                    Token.Keywords.Queries.From,
                    Token.Identifiers.RangeVariableName("o"),
                    Token.Keywords.Queries.In,
                    Token.Variables.ReadWrite("orders"),
                    Token.Keywords.Queries.OrderBy,
                    Token.Variables.Object("o"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("Customer"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("Name"),
                    Token.Punctuation.Comma,
                    Token.Variables.Object("o"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("Total")
                ]);
            });

            it("from clause, orderby ascending", () => {
                const input = Input.InMethod(`
var q = from o in orders
        orderby o.Customer.Name ascending, o.Total
`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("q"),
                    Token.Operators.Assignment,
                    Token.Keywords.Queries.From,
                    Token.Identifiers.RangeVariableName("o"),
                    Token.Keywords.Queries.In,
                    Token.Variables.ReadWrite("orders"),
                    Token.Keywords.Queries.OrderBy,
                    Token.Variables.Object("o"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("Customer"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("Name"),
                    Token.Keywords.Queries.Ascending,
                    Token.Punctuation.Comma,
                    Token.Variables.Object("o"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("Total")
                ]);
            });

            it("from clause, orderby descending", () => {
                const input = Input.InMethod(`
var q = from o in orders
        orderby o.Customer.Name, o.Total descending
`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("q"),
                    Token.Operators.Assignment,
                    Token.Keywords.Queries.From,
                    Token.Identifiers.RangeVariableName("o"),
                    Token.Keywords.Queries.In,
                    Token.Variables.ReadWrite("orders"),
                    Token.Keywords.Queries.OrderBy,
                    Token.Variables.Object("o"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("Customer"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("Name"),
                    Token.Punctuation.Comma,
                    Token.Variables.Object("o"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("Total"),
                    Token.Keywords.Queries.Descending
                ]);
            });

            it("from and select", () => {
                const input = Input.InMethod(`
var q = from n in numbers
        select n;`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("q"),
                    Token.Operators.Assignment,
                    Token.Keywords.Queries.From,
                    Token.Identifiers.RangeVariableName("n"),
                    Token.Keywords.Queries.In,
                    Token.Variables.ReadWrite("numbers"),
                    Token.Keywords.Queries.Select,
                    Token.Variables.ReadWrite("n"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("from and select with complex expressions", () => {
                const input = Input.InMethod(`
var q = from n in new[] { 1, 3, 5, 7, 9 }
        select n % 4 * 6;`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("q"),
                    Token.Operators.Assignment,
                    Token.Keywords.Queries.From,
                    Token.Identifiers.RangeVariableName("n"),
                    Token.Keywords.Queries.In,
                    Token.Keywords.New,
                    Token.Punctuation.OpenBracket,
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.OpenBrace,
                    Token.Literals.Numeric.Decimal("1"),
                    Token.Punctuation.Comma,
                    Token.Literals.Numeric.Decimal("3"),
                    Token.Punctuation.Comma,
                    Token.Literals.Numeric.Decimal("5"),
                    Token.Punctuation.Comma,
                    Token.Literals.Numeric.Decimal("7"),
                    Token.Punctuation.Comma,
                    Token.Literals.Numeric.Decimal("9"),
                    Token.Punctuation.CloseBrace,
                    Token.Keywords.Queries.Select,
                    Token.Variables.ReadWrite("n"),
                    Token.Operators.Arithmetic.Remainder,
                    Token.Literals.Numeric.Decimal("4"),
                    Token.Operators.Arithmetic.Multiplication,
                    Token.Literals.Numeric.Decimal("6"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("from and group by", () => {
                const input = Input.InMethod(`
var q = from c in customers
        group c by c.Country into g`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("q"),
                    Token.Operators.Assignment,
                    Token.Keywords.Queries.From,
                    Token.Identifiers.RangeVariableName("c"),
                    Token.Keywords.Queries.In,
                    Token.Variables.ReadWrite("customers"),
                    Token.Keywords.Queries.Group,
                    Token.Variables.ReadWrite("c"),
                    Token.Keywords.Queries.By,
                    Token.Variables.Object("c"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("Country"),
                    Token.Keywords.Queries.Into,
                    Token.Identifiers.RangeVariableName("g")
                ]);
            });

            it("parenthesized", () => {
                const input = Input.InMethod(`
var q = (from x in "abc" select x);
string s;`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("q"),
                    Token.Operators.Assignment,
                    Token.Punctuation.OpenParen,
                    Token.Keywords.Queries.From,
                    Token.Identifiers.RangeVariableName("x"),
                    Token.Keywords.Queries.In,
                    Token.Punctuation.String.Begin,
                    Token.Literals.String("abc"),
                    Token.Punctuation.String.End,
                    Token.Keywords.Queries.Select,
                    Token.Variables.ReadWrite("x"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon,
                    Token.PrimitiveType.String,
                    Token.Identifiers.LocalName("s"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("highlight complex query properly (issue omnisharp-vscode#1106)", () => {
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
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Modifiers.Private,
                    Token.Keywords.Modifiers.Static,
                    Token.Keywords.Modifiers.ReadOnly,
                    Token.Type("Parser"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.Type("Node"),
                    Token.Punctuation.TypeParameters.End,
                    Token.Identifiers.FieldName("NodeParser"),
                    Token.Operators.Assignment,

                    // from name in NodeName.Token()
                    Token.Keywords.Queries.From,
                    Token.Identifiers.RangeVariableName("name"),
                    Token.Keywords.Queries.In,
                    Token.Variables.Object("NodeName"),
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("Token"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,

                    // from type in NodeValueType.Token()
                    Token.Keywords.Queries.From,
                    Token.Identifiers.RangeVariableName("type"),
                    Token.Keywords.Queries.In,
                    Token.Variables.Object("NodeValueType"),
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("Token"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,

                    // from eq in Parse.Char('=')
                    Token.Keywords.Queries.From,
                    Token.Identifiers.RangeVariableName("eq"),
                    Token.Keywords.Queries.In,
                    Token.Variables.Object("Parse"),
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("Char"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.Char.Begin,
                    Token.Literals.Char("="),
                    Token.Punctuation.Char.End,
                    Token.Punctuation.CloseParen,

                    // from value in QuotedString.Token()
                    Token.Keywords.Queries.From,
                    Token.Identifiers.RangeVariableName("value"),
                    Token.Keywords.Queries.In,
                    Token.Variables.Object("QuotedString"),
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("Token"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,

                    // from lcurl in Parse.Char('{').Token()
                    Token.Keywords.Queries.From,
                    Token.Identifiers.RangeVariableName("lcurl"),
                    Token.Keywords.Queries.In,
                    Token.Variables.Object("Parse"),
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("Char"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.Char.Begin,
                    Token.Literals.Char("{"),
                    Token.Punctuation.Char.End,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("Token"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,

                    // from children in Parse.Ref(() => ChildrenNodesParser)
                    Token.Keywords.Queries.From,
                    Token.Identifiers.RangeVariableName("children"),
                    Token.Keywords.Queries.In,
                    Token.Variables.Object("Parse"),
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("Ref"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Operators.Arrow,
                    Token.Variables.ReadWrite("ChildrenNodesParser"),
                    Token.Punctuation.CloseParen,

                    // from rcurl in Parse.Char('}').Token()
                    Token.Keywords.Queries.From,
                    Token.Identifiers.RangeVariableName("rcurl"),
                    Token.Keywords.Queries.In,
                    Token.Variables.Object("Parse"),
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("Char"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.Char.Begin,
                    Token.Literals.Char("}"),
                    Token.Punctuation.Char.End,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("Token"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,

                    // select new Node
                    // {
                    //     Name = name,
                    //     Type = type,
                    //     Value = value,
                    //     Children = children
                    // };
                    Token.Keywords.Queries.Select,
                    Token.Keywords.New,
                    Token.Type("Node"),
                    Token.Punctuation.OpenBrace,
                    Token.Variables.ReadWrite("Name"),
                    Token.Operators.Assignment,
                    Token.Variables.ReadWrite("name"),
                    Token.Punctuation.Comma,
                    Token.Variables.ReadWrite("Type"),
                    Token.Operators.Assignment,
                    Token.Variables.ReadWrite("type"),
                    Token.Punctuation.Comma,
                    Token.Variables.ReadWrite("Value"),
                    Token.Operators.Assignment,
                    Token.Variables.ReadWrite("value"),
                    Token.Punctuation.Comma,
                    Token.Variables.ReadWrite("Children"),
                    Token.Operators.Assignment,
                    Token.Variables.ReadWrite("children"),
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("query join with anonymous type (issue #89)", () => {
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
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("q"),
                    Token.Operators.Assignment,
                    Token.Keywords.Queries.From,
                    Token.Identifiers.RangeVariableName("x"),
                    Token.Keywords.Queries.In,
                    Token.Variables.ReadWrite("list1"),
                    Token.Keywords.Queries.Join,
                    Token.Identifiers.RangeVariableName("y"),
                    Token.Keywords.Queries.In,
                    Token.Variables.ReadWrite("list2"),
                    Token.Keywords.Queries.On,
                    Token.Keywords.New,
                    Token.Punctuation.OpenBrace,
                    Token.Variables.Object("x"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("Key1"),
                    Token.Punctuation.Comma,
                    Token.Variables.Object("x"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("Key2"),
                    Token.Punctuation.CloseBrace,
                    Token.Keywords.Queries.Equals,
                    Token.Keywords.New,
                    Token.Punctuation.OpenBrace,
                    Token.Variables.Object("y"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("Key1"),
                    Token.Punctuation.Comma,
                    Token.Variables.Object("y"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("Key2"),
                    Token.Punctuation.CloseBrace,
                    Token.Keywords.Queries.Select,
                    Token.Variables.Object("x"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("Key1"),
                    Token.Punctuation.Semicolon
                ]);
            });
        });

        describe("Throw expressions", () => {
            it("throw expression in expression-bodied member (issue #69)", () => {
                const input = Input.InClass(`public static void A(string str) => throw new Exception(str);`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Modifiers.Public,
                    Token.Keywords.Modifiers.Static,
                    Token.PrimitiveType.Void,
                    Token.Identifiers.MethodName("A"),
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.String,
                    Token.Identifiers.ParameterName("str"),
                    Token.Punctuation.CloseParen,
                    Token.Operators.Arrow,
                    Token.Keywords.Control.Throw,
                    Token.Keywords.New,
                    Token.Type("Exception"),
                    Token.Punctuation.OpenParen,
                    Token.Variables.ReadWrite("str"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("throw expression in assignment", () => {
                const input = Input.InMethod(`_field = field ?? throw new ArgumentNullException(nameof(field));`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Variables.ReadWrite("_field"),
                    Token.Operators.Assignment,
                    Token.Variables.ReadWrite("field"),
                    Token.Operators.NullCoalescing,
                    Token.Keywords.Control.Throw,
                    Token.Keywords.New,
                    Token.Type("ArgumentNullException"),
                    Token.Punctuation.OpenParen,
                    Token.Keywords.NameOf,
                    Token.Punctuation.OpenParen,
                    Token.Variables.ReadWrite("field"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });
        });
    });
});