/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe("Operators", () => {
    before(() => { should(); });

    describe("Operators", () => {
        it("unary +", async () => {

            const input = Input.InClass(`public static int operator +(int value) { return +value; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Static,
                Token.PrimitiveType.Int,
                Token.Keyword.Definition.Operator,
                Token.Identifier.MethodName("+"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("value"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Flow.Return,
                Token.Operator.Arithmetic.Addition,
                Token.Variable.Value,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("unary -", async () => {

            const input = Input.InClass(`public static int operator -(int value) { return -value; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Static,
                Token.PrimitiveType.Int,
                Token.Keyword.Definition.Operator,
                Token.Identifier.MethodName("-"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("value"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Flow.Return,
                Token.Operator.Arithmetic.Subtraction,
                Token.Variable.Value,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("unary !", async () => {

            const input = Input.InClass(`public static bool operator !(int value) { return value == 0; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Static,
                Token.PrimitiveType.Bool,
                Token.Keyword.Definition.Operator,
                Token.Identifier.MethodName("!"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("value"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Flow.Return,
                Token.Variable.Value,
                Token.Operator.Relational.Equals,
                Token.Literal.Numeric.Decimal("0"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("unary ~", async () => {

            const input = Input.InClass(`public static int operator ~(int value) { return ~value; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Static,
                Token.PrimitiveType.Int,
                Token.Keyword.Definition.Operator,
                Token.Identifier.MethodName("~"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("value"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Flow.Return,
                Token.Operator.Bitwise.BitwiseComplement,
                Token.Variable.Value,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("unary ++", async () => {

            const input = Input.InClass(`public static int operator ++(int value) { return ++value; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Static,
                Token.PrimitiveType.Int,
                Token.Keyword.Definition.Operator,
                Token.Identifier.MethodName("++"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("value"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Flow.Return,
                Token.Operator.Increment,
                Token.Variable.Value,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("unary --", async () => {

            const input = Input.InClass(`public static int operator --(int value) { return --value; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Static,
                Token.PrimitiveType.Int,
                Token.Keyword.Definition.Operator,
                Token.Identifier.MethodName("--"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("value"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Flow.Return,
                Token.Operator.Decrement,
                Token.Variable.Value,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("unary true", async () => {
            const input = Input.InClass(`public static int operator true(int value) { return value != 0; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Static,
                Token.PrimitiveType.Int,
                Token.Keyword.Definition.Operator,
                Token.Identifier.MethodName("true"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("value"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Flow.Return,
                Token.Variable.Value,
                Token.Operator.Relational.NotEqual,
                Token.Literal.Numeric.Decimal("0"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("unary false", async () => {

            const input = Input.InClass(`public static int operator false(int value) { return value == 0; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Static,
                Token.PrimitiveType.Int,
                Token.Keyword.Definition.Operator,
                Token.Identifier.MethodName("false"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("value"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Flow.Return,
                Token.Variable.Value,
                Token.Operator.Relational.Equals,
                Token.Literal.Numeric.Decimal("0"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("static method operatortrue", async () => {
            const input = Input.InClass(`public static bool operatortrue(int value) { return value != 0; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Static,
                Token.PrimitiveType.Bool,
                Token.Identifier.MethodName("operatortrue"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("value"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Flow.Return,
                Token.Variable.Value,
                Token.Operator.Relational.NotEqual,
                Token.Literal.Numeric.Decimal("0"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("binary +", async () => {

            const input = Input.InClass(`public static int operator +(int x, int y) { return x + y; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Static,
                Token.PrimitiveType.Int,
                Token.Keyword.Definition.Operator,
                Token.Identifier.MethodName("+"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("y"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Flow.Return,
                Token.Variable.ReadWrite("x"),
                Token.Operator.Arithmetic.Addition,
                Token.Variable.ReadWrite("y"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("binary -", async () => {

            const input = Input.InClass(`public static int operator -(int x, int y) { return x - y; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Static,
                Token.PrimitiveType.Int,
                Token.Keyword.Definition.Operator,
                Token.Identifier.MethodName("-"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("y"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Flow.Return,
                Token.Variable.ReadWrite("x"),
                Token.Operator.Arithmetic.Subtraction,
                Token.Variable.ReadWrite("y"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("binary *", async () => {

            const input = Input.InClass(`public static int operator *(int x, int y) { return x * y; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Static,
                Token.PrimitiveType.Int,
                Token.Keyword.Definition.Operator,
                Token.Identifier.MethodName("*"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("y"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Flow.Return,
                Token.Variable.ReadWrite("x"),
                Token.Operator.Arithmetic.Multiplication,
                Token.Variable.ReadWrite("y"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("binary /", async () => {

            const input = Input.InClass(`public static int operator /(int x, int y) { return x / y; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Static,
                Token.PrimitiveType.Int,
                Token.Keyword.Definition.Operator,
                Token.Identifier.MethodName("/"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("y"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Flow.Return,
                Token.Variable.ReadWrite("x"),
                Token.Operator.Arithmetic.Division,
                Token.Variable.ReadWrite("y"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("binary %", async () => {

            const input = Input.InClass(`public static int operator %(int x, int y) { return x % y; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Static,
                Token.PrimitiveType.Int,
                Token.Keyword.Definition.Operator,
                Token.Identifier.MethodName("%"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("y"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Flow.Return,
                Token.Variable.ReadWrite("x"),
                Token.Operator.Arithmetic.Remainder,
                Token.Variable.ReadWrite("y"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("binary &", async () => {

            const input = Input.InClass(`public static int operator &(int x, int y) { return x & y; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Static,
                Token.PrimitiveType.Int,
                Token.Keyword.Definition.Operator,
                Token.Identifier.MethodName("&"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("y"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Flow.Return,
                Token.Variable.ReadWrite("x"),
                Token.Operator.Bitwise.And,
                Token.Variable.ReadWrite("y"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("binary |", async () => {

            const input = Input.InClass(`public static int operator |(int x, int y) { return x | y; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Static,
                Token.PrimitiveType.Int,
                Token.Keyword.Definition.Operator,
                Token.Identifier.MethodName("|"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("y"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Flow.Return,
                Token.Variable.ReadWrite("x"),
                Token.Operator.Bitwise.Or,
                Token.Variable.ReadWrite("y"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("binary ^", async () => {

            const input = Input.InClass(`public static int operator ^(int x, int y) { return x ^ y; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Static,
                Token.PrimitiveType.Int,
                Token.Keyword.Definition.Operator,
                Token.Identifier.MethodName("^"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("y"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Flow.Return,
                Token.Variable.ReadWrite("x"),
                Token.Operator.Bitwise.ExclusiveOr,
                Token.Variable.ReadWrite("y"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("binary <<", async () => {

            const input = Input.InClass(`public static int operator <<(int x, int y) { return x << y; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Static,
                Token.PrimitiveType.Int,
                Token.Keyword.Definition.Operator,
                Token.Identifier.MethodName("<<"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("y"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Flow.Return,
                Token.Variable.ReadWrite("x"),
                Token.Operator.Bitwise.ShiftLeft,
                Token.Variable.ReadWrite("y"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("binary >>", async () => {

            const input = Input.InClass(`public static int operator >>(int x, int y) { return x >> y; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Static,
                Token.PrimitiveType.Int,
                Token.Keyword.Definition.Operator,
                Token.Identifier.MethodName(">>"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("y"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Flow.Return,
                Token.Variable.ReadWrite("x"),
                Token.Operator.Bitwise.ShiftRight,
                Token.Variable.ReadWrite("y"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("binary >>>", async () => {
            const input = Input.InClass(`public static nuint operator >>>(nuint x, int y) { return x >>> y; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Static,
                Token.PrimitiveType.Nuint,
                Token.Keyword.Definition.Operator,
                Token.Identifier.MethodName(">>>"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Nuint,
                Token.Identifier.ParameterName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("y"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Flow.Return,
                Token.Variable.ReadWrite("x"),
                Token.Operator.Bitwise.ShiftRightUnsigned,
                Token.Variable.ReadWrite("y"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("binary ==", async () => {

            const input = Input.InClass(`public static bool operator ==(int x, int y) { return x == y; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Static,
                Token.PrimitiveType.Bool,
                Token.Keyword.Definition.Operator,
                Token.Identifier.MethodName("=="),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("y"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Flow.Return,
                Token.Variable.ReadWrite("x"),
                Token.Operator.Relational.Equals,
                Token.Variable.ReadWrite("y"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("binary !=", async () => {

            const input = Input.InClass(`public static bool operator !=(int x, int y) { return x != y; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Static,
                Token.PrimitiveType.Bool,
                Token.Keyword.Definition.Operator,
                Token.Identifier.MethodName("!="),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("y"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Flow.Return,
                Token.Variable.ReadWrite("x"),
                Token.Operator.Relational.NotEqual,
                Token.Variable.ReadWrite("y"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("binary >", async () => {

            const input = Input.InClass(`public static bool operator >(int x, int y) { return x > y; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Static,
                Token.PrimitiveType.Bool,
                Token.Keyword.Definition.Operator,
                Token.Identifier.MethodName(">"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("y"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Flow.Return,
                Token.Variable.ReadWrite("x"),
                Token.Operator.Relational.GreaterThan,
                Token.Variable.ReadWrite("y"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("binary <", async () => {

            const input = Input.InClass(`public static bool operator <(int x, int y) { return x < y; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Static,
                Token.PrimitiveType.Bool,
                Token.Keyword.Definition.Operator,
                Token.Identifier.MethodName("<"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("y"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Flow.Return,
                Token.Variable.ReadWrite("x"),
                Token.Operator.Relational.LessThan,
                Token.Variable.ReadWrite("y"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("binary >=", async () => {

            const input = Input.InClass(`public static bool operator >=(int x, int y) { return x >= y; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Static,
                Token.PrimitiveType.Bool,
                Token.Keyword.Definition.Operator,
                Token.Identifier.MethodName(">="),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("y"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Flow.Return,
                Token.Variable.ReadWrite("x"),
                Token.Operator.Relational.GreaterThanOrEqual,
                Token.Variable.ReadWrite("y"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("binary <=", async () => {

            const input = Input.InClass(`public static bool operator <=(int x, int y) { return x <= y; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Static,
                Token.PrimitiveType.Bool,
                Token.Keyword.Definition.Operator,
                Token.Identifier.MethodName("<="),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("y"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Flow.Return,
                Token.Variable.ReadWrite("x"),
                Token.Operator.Relational.LessThanOrEqual,
                Token.Variable.ReadWrite("y"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("implicit conversion", async () => {

            const input = Input.InClass(`public static implicit operator bool(int x) { return x != 0; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Static,
                Token.Keyword.Modifier.Implicit,
                Token.Keyword.Definition.Operator,
                Token.PrimitiveType.Bool,
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("x"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Flow.Return,
                Token.Variable.ReadWrite("x"),
                Token.Operator.Relational.NotEqual,
                Token.Literal.Numeric.Decimal("0"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("explicit conversion", async () => {

            const input = Input.InClass(`public static explicit operator bool(int x) { return x != 0; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Static,
                Token.Keyword.Modifier.Explicit,
                Token.Keyword.Definition.Operator,
                Token.PrimitiveType.Bool,
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("x"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Flow.Return,
                Token.Variable.ReadWrite("x"),
                Token.Operator.Relational.NotEqual,
                Token.Literal.Numeric.Decimal("0"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("with expression body", async () => {

            const input = Input.InClass(`public static int operator +(int value) => +value;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Static,
                Token.PrimitiveType.Int,
                Token.Keyword.Definition.Operator,
                Token.Identifier.MethodName("+"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("value"),
                Token.Punctuation.CloseParen,
                Token.Operator.Arrow,
                Token.Operator.Arithmetic.Addition,
                Token.Variable.Value,
                Token.Punctuation.Semicolon]);
        });

        it("ref return", async () => {
            const input = Input.InClass(`public static ref int operator +(int value) { return ref x; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Static,
                Token.Keyword.Modifier.Ref,
                Token.PrimitiveType.Int,
                Token.Keyword.Definition.Operator,
                Token.Identifier.MethodName("+"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("value"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Flow.Return,
                Token.Keyword.Modifier.Ref,
                Token.Variable.ReadWrite("x"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("ref readonly return", async () => {
            const input = Input.InClass(`public static ref readonly int operator +(int value) { return ref x; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Static,
                Token.Keyword.Modifier.Ref,
                Token.Keyword.Modifier.ReadOnly,
                Token.PrimitiveType.Int,
                Token.Keyword.Definition.Operator,
                Token.Identifier.MethodName("+"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("value"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Flow.Return,
                Token.Keyword.Modifier.Ref,
                Token.Variable.ReadWrite("x"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("expression body ref return", async () => {
            const input = Input.InClass(`public static ref int operator +(int value) => ref x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Static,
                Token.Keyword.Modifier.Ref,
                Token.PrimitiveType.Int,
                Token.Keyword.Definition.Operator,
                Token.Identifier.MethodName("+"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("value"),
                Token.Punctuation.CloseParen,
                Token.Operator.Arrow,
                Token.Keyword.Modifier.Ref,
                Token.Variable.ReadWrite("x"),
                Token.Punctuation.Semicolon]);
        });

        it("expression body ref readonly return", async () => {
            const input = Input.InClass(`public static ref readonly int operator +(int value) => ref x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Static,
                Token.Keyword.Modifier.Ref,
                Token.Keyword.Modifier.ReadOnly,
                Token.PrimitiveType.Int,
                Token.Keyword.Definition.Operator,
                Token.Identifier.MethodName("+"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("value"),
                Token.Punctuation.CloseParen,
                Token.Operator.Arrow,
                Token.Keyword.Modifier.Ref,
                Token.Variable.ReadWrite("x"),
                Token.Punctuation.Semicolon]);
        });
    });
});