/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe("Statements", () => {
    before(() => { should(); });

    describe("Statements", () => {
        describe("Checked/Unchecked", () => {
            it("checked statement", async () => {
                const input = Input.InMethod(`
checked
{
}`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Context.Checked,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace
                ]);
            });

            it("unchecked statement", async () => {
                const input = Input.InMethod(`
unchecked
{
}`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Context.Unchecked,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace
                ]);
            });
        });

        describe("Do", () => {
            it("single-line do..while loop", async () => {
                const input = Input.InMethod(`do { } while (true);`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Loop.Do,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Keyword.Loop.While,
                    Token.Punctuation.OpenParen,
                    Token.Literal.Boolean.True,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });
        });

        describe("Fixed", () => {
            it("fixed with block", async () => {
                const input = Input.InMethod(`
fixed (byte* p = bytes) { }`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Context.Fixed,
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.Byte,
                    Token.Punctuation.Asterisk,
                    Token.Identifier.LocalName("p"),
                    Token.Operator.Assignment,
                    Token.Variable.ReadWrite("bytes"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace
                ]);
            });
        });

        describe("For", () => {
            it("single-line for loop", async () => {
                const input = Input.InMethod(`for (int i = 0; i < 42; i++) { }`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Loop.For,
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.Int,
                    Token.Identifier.LocalName("i"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Decimal("0"),
                    Token.Punctuation.Semicolon,
                    Token.Variable.ReadWrite("i"),
                    Token.Operator.Relational.LessThan,
                    Token.Literal.Numeric.Decimal("42"),
                    Token.Punctuation.Semicolon,
                    Token.Variable.ReadWrite("i"),
                    Token.Operator.Increment,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                ]);
            });

            it("for loop with break", async () => {
                const input = Input.InMethod(`
for (int i = 0; i < 42; i++)
{
    break;
}`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Loop.For,
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.Int,
                    Token.Identifier.LocalName("i"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Decimal("0"),
                    Token.Punctuation.Semicolon,
                    Token.Variable.ReadWrite("i"),
                    Token.Operator.Relational.LessThan,
                    Token.Literal.Numeric.Decimal("42"),
                    Token.Punctuation.Semicolon,
                    Token.Variable.ReadWrite("i"),
                    Token.Operator.Increment,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Keyword.Flow.Break,
                    Token.Punctuation.Semicolon,
                    Token.Punctuation.CloseBrace,
                ]);
            });

            it("for loop with continue", async () => {
                const input = Input.InMethod(`
for (int i = 0; i < 42; i++)
{
    continue;
}`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Loop.For,
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.Int,
                    Token.Identifier.LocalName("i"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Decimal("0"),
                    Token.Punctuation.Semicolon,
                    Token.Variable.ReadWrite("i"),
                    Token.Operator.Relational.LessThan,
                    Token.Literal.Numeric.Decimal("42"),
                    Token.Punctuation.Semicolon,
                    Token.Variable.ReadWrite("i"),
                    Token.Operator.Increment,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Keyword.Flow.Continue,
                    Token.Punctuation.Semicolon,
                    Token.Punctuation.CloseBrace,
                ]);
            });

            it("for loop with continue (no initializer)", async () => {
                const input = Input.InMethod(`
int i = 0;
for (; i < 10; i++)
{
    continue;
}
`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Int,
                    Token.Identifier.LocalName("i"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Decimal("0"),
                    Token.Punctuation.Semicolon,
                    Token.Keyword.Loop.For,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.Semicolon,
                    Token.Variable.ReadWrite("i"),
                    Token.Operator.Relational.LessThan,
                    Token.Literal.Numeric.Decimal("10"),
                    Token.Punctuation.Semicolon,
                    Token.Variable.ReadWrite("i"),
                    Token.Operator.Increment,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Keyword.Flow.Continue,
                    Token.Punctuation.Semicolon,
                    Token.Punctuation.CloseBrace,
                ]);
            });

            it("for loop with continue (no initializer, no condition)", async () => {
                const input = Input.InMethod(`
int i = 0;
for (;; i++)
{
    if (i < 10)
        continue;
    break;
}
`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Int,
                    Token.Identifier.LocalName("i"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Decimal("0"),
                    Token.Punctuation.Semicolon,
                    Token.Keyword.Loop.For,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.Semicolon,
                    Token.Punctuation.Semicolon,
                    Token.Variable.ReadWrite("i"),
                    Token.Operator.Increment,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Keyword.Conditional.If,
                    Token.Punctuation.OpenParen,
                    Token.Variable.ReadWrite("i"),
                    Token.Operator.Relational.LessThan,
                    Token.Literal.Numeric.Decimal("10"),
                    Token.Punctuation.CloseParen,
                    Token.Keyword.Flow.Continue,
                    Token.Punctuation.Semicolon,
                    Token.Keyword.Flow.Break,
                    Token.Punctuation.Semicolon,
                    Token.Punctuation.CloseBrace,
                ]);
            });

            it("for loop with continue (no initializer, no condition, no iterator)", async () => {
                const input = Input.InMethod(`
int i = 0;
for (;;)
{
    i++;
    if (i < 10)
        continue;
    break;
}
`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Int,
                    Token.Identifier.LocalName("i"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Decimal("0"),
                    Token.Punctuation.Semicolon,
                    Token.Keyword.Loop.For,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.Semicolon,
                    Token.Punctuation.Semicolon,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Variable.ReadWrite("i"),
                    Token.Operator.Increment,
                    Token.Punctuation.Semicolon,
                    Token.Keyword.Conditional.If,
                    Token.Punctuation.OpenParen,
                    Token.Variable.ReadWrite("i"),
                    Token.Operator.Relational.LessThan,
                    Token.Literal.Numeric.Decimal("10"),
                    Token.Punctuation.CloseParen,
                    Token.Keyword.Flow.Continue,
                    Token.Punctuation.Semicolon,
                    Token.Keyword.Flow.Break,
                    Token.Punctuation.Semicolon,
                    Token.Punctuation.CloseBrace,
                ]);
            });

            it("for loop with argument multiplication (issue #99)", async () => {
                const input = Input.InMethod(`
    for (int i = 0; i < n1 * n2; i++)
    {
    }`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Loop.For,
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.Int,
                    Token.Identifier.LocalName("i"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Decimal("0"),
                    Token.Punctuation.Semicolon,
                    Token.Variable.ReadWrite("i"),
                    Token.Operator.Relational.LessThan,
                    Token.Variable.ReadWrite("n1"),
                    Token.Operator.Arithmetic.Multiplication,
                    Token.Variable.ReadWrite("n2"),
                    Token.Punctuation.Semicolon,
                    Token.Variable.ReadWrite("i"),
                    Token.Operator.Increment,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                ]);
            });
        });

        describe("ForEach", () => {
            it("single-line foreach loop", async () => {
                const input = Input.InMethod(`foreach (int i in numbers) { }`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Loop.ForEach,
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.Int,
                    Token.Identifier.LocalName("i"),
                    Token.Keyword.Loop.In,
                    Token.Variable.ReadWrite("numbers"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                ]);
            });

            it("foreach loop with var (issue omnisharp-vscode#816)", async () => {
                const input = Input.InMethod(`
foreach (var s in myList)
{

}`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Loop.ForEach,
                    Token.Punctuation.OpenParen,
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("s"),
                    Token.Keyword.Loop.In,
                    Token.Variable.ReadWrite("myList"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                ]);
            });

            it("foreach loop with ref var (issue #308)", async () => {
                const input = Input.InMethod(`
foreach (ref var i in span) {}`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Loop.ForEach,
                    Token.Punctuation.OpenParen,
                    Token.Keyword.Modifier.Ref,
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("i"),
                    Token.Keyword.Loop.In,
                    Token.Variable.ReadWrite("span"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                ]);
            });
        });

        describe("While", () => {
            it("single-line while loop", async () => {
                const input = Input.InMethod(`while (true) { }`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Loop.While,
                    Token.Punctuation.OpenParen,
                    Token.Literal.Boolean.True,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace
                ]);
            });
        });

        describe("If", () => {
            it("single-line if with embedded statement", async () => {
                const input = Input.InMethod(`if (true) return;`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Conditional.If,
                    Token.Punctuation.OpenParen,
                    Token.Literal.Boolean.True,
                    Token.Punctuation.CloseParen,
                    Token.Keyword.Flow.Return,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("single-line if with embedded method call", async () => {
                const input = Input.InMethod(`if (true) Do();`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Conditional.If,
                    Token.Punctuation.OpenParen,
                    Token.Literal.Boolean.True,
                    Token.Punctuation.CloseParen,
                    Token.Identifier.MethodName("Do"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("single-line if with block", async () => {
                const input = Input.InMethod(`if (true) { Do(); }`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Conditional.If,
                    Token.Punctuation.OpenParen,
                    Token.Literal.Boolean.True,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Identifier.MethodName("Do"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon,
                    Token.Punctuation.CloseBrace
                ]);
            });

            it("if with embedded statement", async () => {
                const input = Input.InMethod(`
if (true)
    Do();
`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Conditional.If,
                    Token.Punctuation.OpenParen,
                    Token.Literal.Boolean.True,
                    Token.Punctuation.CloseParen,
                    Token.Identifier.MethodName("Do"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("if with block", async () => {
                const input = Input.InMethod(`
if (true)
{
    Do();
}`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Conditional.If,
                    Token.Punctuation.OpenParen,
                    Token.Literal.Boolean.True,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Identifier.MethodName("Do"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon,
                    Token.Punctuation.CloseBrace
                ]);
            });

            it("if-else with embedded statements", async () => {
                const input = Input.InMethod(`
if (true)
    Do();
else
    Dont();
`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Conditional.If,
                    Token.Punctuation.OpenParen,
                    Token.Literal.Boolean.True,
                    Token.Punctuation.CloseParen,
                    Token.Identifier.MethodName("Do"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon,
                    Token.Keyword.Conditional.Else,
                    Token.Identifier.MethodName("Dont"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("if-else with blocks", async () => {
                const input = Input.InMethod(`
if (true)
{
    Do();
}
else
{
    Dont();
}`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Conditional.If,
                    Token.Punctuation.OpenParen,
                    Token.Literal.Boolean.True,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Identifier.MethodName("Do"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon,
                    Token.Punctuation.CloseBrace,
                    Token.Keyword.Conditional.Else,
                    Token.Punctuation.OpenBrace,
                    Token.Identifier.MethodName("Dont"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon,
                    Token.Punctuation.CloseBrace
                ]);
            });

            it("if-elseif with embedded statements", async () => {
                const input = Input.InMethod(`
if (true)
    Do();
else if (false)
    Dont();
`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Conditional.If,
                    Token.Punctuation.OpenParen,
                    Token.Literal.Boolean.True,
                    Token.Punctuation.CloseParen,
                    Token.Identifier.MethodName("Do"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon,
                    Token.Keyword.Conditional.Else,
                    Token.Keyword.Conditional.If,
                    Token.Punctuation.OpenParen,
                    Token.Literal.Boolean.False,
                    Token.Punctuation.CloseParen,
                    Token.Identifier.MethodName("Dont"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("if-elseif with blocks", async () => {
                const input = Input.InMethod(`
if (true)
{
    Do();
}
else if (false)
{
    Dont();
}`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Conditional.If,
                    Token.Punctuation.OpenParen,
                    Token.Literal.Boolean.True,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Identifier.MethodName("Do"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon,
                    Token.Punctuation.CloseBrace,
                    Token.Keyword.Conditional.Else,
                    Token.Keyword.Conditional.If,
                    Token.Punctuation.OpenParen,
                    Token.Literal.Boolean.False,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Identifier.MethodName("Dont"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon,
                    Token.Punctuation.CloseBrace
                ]);
            });

            it("if statement inside while statment with continue and break", async () => {
                const input = Input.InMethod(`
while (i < 10)
{
    ++i;
    if (true) continue;
    break;
}`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Loop.While,
                    Token.Punctuation.OpenParen,
                    Token.Variable.ReadWrite("i"),
                    Token.Operator.Relational.LessThan,
                    Token.Literal.Numeric.Decimal("10"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Operator.Increment,
                    Token.Variable.ReadWrite("i"),
                    Token.Punctuation.Semicolon,
                    Token.Keyword.Conditional.If,
                    Token.Punctuation.OpenParen,
                    Token.Literal.Boolean.True,
                    Token.Punctuation.CloseParen,
                    Token.Keyword.Flow.Continue,
                    Token.Punctuation.Semicolon,
                    Token.Keyword.Flow.Break,
                    Token.Punctuation.Semicolon,
                    Token.Punctuation.CloseBrace
                ]);
            });
        });

        describe("Lock", () => {
            it("single-line lock with embedded statement", async () => {
                const input = Input.InMethod(`lock (new object()) Do();`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Context.Lock,
                    Token.Punctuation.OpenParen,
                    Token.Operator.Expression.New,
                    Token.PrimitiveType.Object,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.CloseParen,
                    Token.Identifier.MethodName("Do"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("single-line lock with block", async () => {
                const input = Input.InMethod(`lock (new object()) { Do(); }`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Context.Lock,
                    Token.Punctuation.OpenParen,
                    Token.Operator.Expression.New,
                    Token.PrimitiveType.Object,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Identifier.MethodName("Do"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon,
                    Token.Punctuation.CloseBrace
                ]);
            });

            it("lock with embedded statement", async () => {
                const input = Input.InMethod(`
lock (new object())
    Do();`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Context.Lock,
                    Token.Punctuation.OpenParen,
                    Token.Operator.Expression.New,
                    Token.PrimitiveType.Object,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.CloseParen,
                    Token.Identifier.MethodName("Do"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("lock with block", async () => {
                const input = Input.InMethod(`
lock (new object())
{
    Do();
}`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Context.Lock,
                    Token.Punctuation.OpenParen,
                    Token.Operator.Expression.New,
                    Token.PrimitiveType.Object,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Identifier.MethodName("Do"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon,
                    Token.Punctuation.CloseBrace
                ]);
            });
        });

        describe("Switch", () => {
            it("switch statement", async () => {
                const input = Input.InMethod(`
switch (i) {
case 0:
    goto case 1;
case 1:
    goto default;
default:
    break;
}`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Conditional.Switch,
                    Token.Punctuation.OpenParen,
                    Token.Variable.ReadWrite("i"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Keyword.Conditional.Case,
                    Token.Literal.Numeric.Decimal("0"),
                    Token.Punctuation.Colon,
                    Token.Keyword.Flow.Goto,
                    Token.Keyword.Conditional.Case,
                    Token.Literal.Numeric.Decimal("1"),
                    Token.Punctuation.Semicolon,
                    Token.Keyword.Conditional.Case,
                    Token.Literal.Numeric.Decimal("1"),
                    Token.Punctuation.Colon,
                    Token.Keyword.Flow.Goto,
                    Token.Keyword.Conditional.Default,
                    Token.Punctuation.Semicolon,
                    Token.Keyword.Conditional.Default,
                    Token.Punctuation.Colon,
                    Token.Keyword.Flow.Break,
                    Token.Punctuation.Semicolon,
                    Token.Punctuation.CloseBrace
                ]);
            });

            it("switch statement with blocks", async () => {
                const input = Input.InMethod(`
switch (i) {
    case 0:
    {
        goto case 1;
    }
    case 1:
    {
        goto default;
    }
    default:
    {
        break;
    }
}`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Conditional.Switch,
                    Token.Punctuation.OpenParen,
                    Token.Variable.ReadWrite("i"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Keyword.Conditional.Case,
                    Token.Literal.Numeric.Decimal("0"),
                    Token.Punctuation.Colon,
                    Token.Punctuation.OpenBrace,
                    Token.Keyword.Flow.Goto,
                    Token.Keyword.Conditional.Case,
                    Token.Literal.Numeric.Decimal("1"),
                    Token.Punctuation.Semicolon,
                    Token.Punctuation.CloseBrace,
                    Token.Keyword.Conditional.Case,
                    Token.Literal.Numeric.Decimal("1"),
                    Token.Punctuation.Colon,
                    Token.Punctuation.OpenBrace,
                    Token.Keyword.Flow.Goto,
                    Token.Keyword.Conditional.Default,
                    Token.Punctuation.Semicolon,
                    Token.Punctuation.CloseBrace,
                    Token.Keyword.Conditional.Default,
                    Token.Punctuation.Colon,
                    Token.Punctuation.OpenBrace,
                    Token.Keyword.Flow.Break,
                    Token.Punctuation.Semicolon,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.CloseBrace
                ]);
            });

            it("switch statement with comment (issue #145)", async () => {
                const input = Input.InMethod(`
switch (i) /* comment */ {
default:
    break;
}`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Conditional.Switch,
                    Token.Punctuation.OpenParen,
                    Token.Variable.ReadWrite("i"),
                    Token.Punctuation.CloseParen,
                    Token.Comment.MultiLine.Start,
                    Token.Comment.MultiLine.Text(" comment "),
                    Token.Comment.MultiLine.End,
                    Token.Punctuation.OpenBrace,
                    Token.Keyword.Conditional.Default,
                    Token.Punctuation.Colon,
                    Token.Keyword.Flow.Break,
                    Token.Punctuation.Semicolon,
                    Token.Punctuation.CloseBrace
                ]);
            });
        });

        describe("Try", () => {
            it("try-finally", async () => {
                const input = Input.InMethod(`
try
{
}
finally
{
}`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Exception.Try,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Keyword.Exception.Finally,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace
                ]);
            });

            it("try-catch", async () => {
                const input = Input.InMethod(`
try
{
}
catch
{
}`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Exception.Try,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Keyword.Exception.Catch,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace
                ]);
            });

            it("try-catch-finally", async () => {
                const input = Input.InMethod(`
try
{
}
catch
{
}
finally
{
}`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Exception.Try,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Keyword.Exception.Catch,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Keyword.Exception.Finally,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace
                ]);
            });

            it("try-catch with exception type", async () => {
                const input = Input.InMethod(`
try
{
}
catch (Exception)
{
}`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Exception.Try,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Keyword.Exception.Catch,
                    Token.Punctuation.OpenParen,
                    Token.Type("Exception"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace
                ]);
            });

            it("try-catch with exception type and identifier", async () => {
                const input = Input.InMethod(`
try
{
}
catch (Exception ex)
{
}`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Exception.Try,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Keyword.Exception.Catch,
                    Token.Punctuation.OpenParen,
                    Token.Type("Exception"),
                    Token.Identifier.LocalName("ex"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace
                ]);
            });

            it("try-catch with exception filter", async () => {
                const input = Input.InMethod(`
try
{
    throw new Exception();
}
catch when (true)
{
}`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Exception.Try,
                    Token.Punctuation.OpenBrace,
                    Token.Keyword.Flow.Throw,
                    Token.Operator.Expression.New,
                    Token.Type("Exception"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon,
                    Token.Punctuation.CloseBrace,
                    Token.Keyword.Exception.Catch,
                    Token.Keyword.Exception.When,
                    Token.Punctuation.OpenParen,
                    Token.Literal.Boolean.True,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace
                ]);
            });

            it("try-catch with exception type and filter", async () => {
                const input = Input.InMethod(`
try
{
}
catch (Exception) when (true)
{
}`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Exception.Try,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Keyword.Exception.Catch,
                    Token.Punctuation.OpenParen,
                    Token.Type("Exception"),
                    Token.Punctuation.CloseParen,
                    Token.Keyword.Exception.When,
                    Token.Punctuation.OpenParen,
                    Token.Literal.Boolean.True,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace
                ]);
            });

            it("try-finally followed by statement", async () => {
                const input = Input.InMethod(`
try
{
}
finally
{
}
int x;`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Exception.Try,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Keyword.Exception.Finally,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.PrimitiveType.Int,
                    Token.Identifier.LocalName("x"),
                    Token.Punctuation.Semicolon
                ]);
            });
        });

        describe("Unsafe", () => {
            it("Unsafe with block", async () => {
                const input = Input.InMethod(`
unsafe { }`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Context.Unsafe,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace
                ]);
            });
        });

        describe("Using", () => {
            it("single-line using with expression and embedded statement", async () => {
                const input = Input.InMethod(`using (new object()) Do();`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Context.Using,
                    Token.Punctuation.OpenParen,
                    Token.Operator.Expression.New,
                    Token.PrimitiveType.Object,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.CloseParen,
                    Token.Identifier.MethodName("Do"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("single-line using with expression and block", async () => {
                const input = Input.InMethod(`using (new object()) { Do(); }`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Context.Using,
                    Token.Punctuation.OpenParen,
                    Token.Operator.Expression.New,
                    Token.PrimitiveType.Object,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Identifier.MethodName("Do"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon,
                    Token.Punctuation.CloseBrace
                ]);
            });

            it("using with expression and embedded statement", async () => {
                const input = Input.InMethod(`
using (new object())
    Do();`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Context.Using,
                    Token.Punctuation.OpenParen,
                    Token.Operator.Expression.New,
                    Token.PrimitiveType.Object,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.CloseParen,
                    Token.Identifier.MethodName("Do"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("using with expression and block", async () => {
                const input = Input.InMethod(`
using (new object())
{
    Do();
}`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Context.Using,
                    Token.Punctuation.OpenParen,
                    Token.Operator.Expression.New,
                    Token.PrimitiveType.Object,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Identifier.MethodName("Do"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon,
                    Token.Punctuation.CloseBrace
                ]);
            });

            it("using with local variable and embedded statement", async () => {
                const input = Input.InMethod(`
using (var o = new object())
    Do();`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Context.Using,
                    Token.Punctuation.OpenParen,
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("o"),
                    Token.Operator.Assignment,
                    Token.Operator.Expression.New,
                    Token.PrimitiveType.Object,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.CloseParen,
                    Token.Identifier.MethodName("Do"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("using with local variable and block", async () => {
                const input = Input.InMethod(`
using (var o = new object())
{
    Do();
}`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Context.Using,
                    Token.Punctuation.OpenParen,
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("o"),
                    Token.Operator.Assignment,
                    Token.Operator.Expression.New,
                    Token.PrimitiveType.Object,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Identifier.MethodName("Do"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon,
                    Token.Punctuation.CloseBrace
                ]);
            });

            it("using declaration var", async () => {
                const input = Input.InMethod(`using var o = new object();`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Context.Using,
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("o"),
                    Token.Operator.Assignment,
                    Token.Operator.Expression.New,
                    Token.PrimitiveType.Object,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ])
            });

            it("using declaration type", async () => {
                const input = Input.InMethod(`using object o = new object();`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Context.Using,
                    Token.PrimitiveType.Object,
                    Token.Identifier.LocalName("o"),
                    Token.Operator.Assignment,
                    Token.Operator.Expression.New,
                    Token.PrimitiveType.Object,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ])
            });

            it("using with await (issue #123)", async () => {
                const input = Input.InMethod(`
using (await foo()) { }`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Context.Using,
                    Token.Punctuation.OpenParen,
                    Token.Operator.Expression.Await,
                    Token.Identifier.MethodName("foo"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                ]);
            });
        });

        describe("Yield", () => {
            it("yield return", async () => {
                const input = Input.InMethod(`yield return 42;`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Flow.Yield,
                    Token.Keyword.Flow.Return,
                    Token.Literal.Numeric.Decimal("42"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("yield break", async () => {
                const input = Input.InMethod(`yield break;`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Flow.Yield,
                    Token.Keyword.Flow.Break,
                    Token.Punctuation.Semicolon
                ]);
            });
        });
    });
});