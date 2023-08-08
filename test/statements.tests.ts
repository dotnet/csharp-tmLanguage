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
                    Token.Keywords.Checked,
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
                    Token.Keywords.Unchecked,
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
                    Token.Keywords.Control.Do,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Keywords.Control.While,
                    Token.Punctuation.OpenParen,
                    Token.Literals.Boolean.True,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });
        });

        describe("For", () => {
            it("single-line for loop", async () => {
                const input = Input.InMethod(`for (int i = 0; i < 42; i++) { }`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Control.For,
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.Int,
                    Token.Identifiers.LocalName("i"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Decimal("0"),
                    Token.Punctuation.Semicolon,
                    Token.Variables.ReadWrite("i"),
                    Token.Operators.Relational.LessThan,
                    Token.Literals.Numeric.Decimal("42"),
                    Token.Punctuation.Semicolon,
                    Token.Variables.ReadWrite("i"),
                    Token.Operators.Increment,
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
                    Token.Keywords.Control.For,
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.Int,
                    Token.Identifiers.LocalName("i"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Decimal("0"),
                    Token.Punctuation.Semicolon,
                    Token.Variables.ReadWrite("i"),
                    Token.Operators.Relational.LessThan,
                    Token.Literals.Numeric.Decimal("42"),
                    Token.Punctuation.Semicolon,
                    Token.Variables.ReadWrite("i"),
                    Token.Operators.Increment,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Keywords.Control.Break,
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
                    Token.Keywords.Control.For,
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.Int,
                    Token.Identifiers.LocalName("i"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Decimal("0"),
                    Token.Punctuation.Semicolon,
                    Token.Variables.ReadWrite("i"),
                    Token.Operators.Relational.LessThan,
                    Token.Literals.Numeric.Decimal("42"),
                    Token.Punctuation.Semicolon,
                    Token.Variables.ReadWrite("i"),
                    Token.Operators.Increment,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Keywords.Control.Continue,
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
                    Token.Keywords.Control.For,
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.Int,
                    Token.Identifiers.LocalName("i"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Decimal("0"),
                    Token.Punctuation.Semicolon,
                    Token.Variables.ReadWrite("i"),
                    Token.Operators.Relational.LessThan,
                    Token.Variables.ReadWrite("n1"),
                    Token.Operators.Arithmetic.Multiplication,
                    Token.Variables.ReadWrite("n2"),
                    Token.Punctuation.Semicolon,
                    Token.Variables.ReadWrite("i"),
                    Token.Operators.Increment,
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
                    Token.Keywords.Control.ForEach,
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.Int,
                    Token.Identifiers.LocalName("i"),
                    Token.Keywords.Control.In,
                    Token.Variables.ReadWrite("numbers"),
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
                    Token.Keywords.Control.ForEach,
                    Token.Punctuation.OpenParen,
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("s"),
                    Token.Keywords.Control.In,
                    Token.Variables.ReadWrite("myList"),
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
                    Token.Keywords.Control.While,
                    Token.Punctuation.OpenParen,
                    Token.Literals.Boolean.True,
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
                    Token.Keywords.Control.If,
                    Token.Punctuation.OpenParen,
                    Token.Literals.Boolean.True,
                    Token.Punctuation.CloseParen,
                    Token.Keywords.Control.Return,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("single-line if with embedded method call", async () => {
                const input = Input.InMethod(`if (true) Do();`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Control.If,
                    Token.Punctuation.OpenParen,
                    Token.Literals.Boolean.True,
                    Token.Punctuation.CloseParen,
                    Token.Identifiers.MethodName("Do"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("single-line if with block", async () => {
                const input = Input.InMethod(`if (true) { Do(); }`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Control.If,
                    Token.Punctuation.OpenParen,
                    Token.Literals.Boolean.True,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Identifiers.MethodName("Do"),
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
                    Token.Keywords.Control.If,
                    Token.Punctuation.OpenParen,
                    Token.Literals.Boolean.True,
                    Token.Punctuation.CloseParen,
                    Token.Identifiers.MethodName("Do"),
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
                    Token.Keywords.Control.If,
                    Token.Punctuation.OpenParen,
                    Token.Literals.Boolean.True,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Identifiers.MethodName("Do"),
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
                    Token.Keywords.Control.If,
                    Token.Punctuation.OpenParen,
                    Token.Literals.Boolean.True,
                    Token.Punctuation.CloseParen,
                    Token.Identifiers.MethodName("Do"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon,
                    Token.Keywords.Control.Else,
                    Token.Identifiers.MethodName("Dont"),
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
                    Token.Keywords.Control.If,
                    Token.Punctuation.OpenParen,
                    Token.Literals.Boolean.True,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Identifiers.MethodName("Do"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon,
                    Token.Punctuation.CloseBrace,
                    Token.Keywords.Control.Else,
                    Token.Punctuation.OpenBrace,
                    Token.Identifiers.MethodName("Dont"),
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
                    Token.Keywords.Control.If,
                    Token.Punctuation.OpenParen,
                    Token.Literals.Boolean.True,
                    Token.Punctuation.CloseParen,
                    Token.Identifiers.MethodName("Do"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon,
                    Token.Keywords.Control.Else,
                    Token.Keywords.Control.If,
                    Token.Punctuation.OpenParen,
                    Token.Literals.Boolean.False,
                    Token.Punctuation.CloseParen,
                    Token.Identifiers.MethodName("Dont"),
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
                    Token.Keywords.Control.If,
                    Token.Punctuation.OpenParen,
                    Token.Literals.Boolean.True,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Identifiers.MethodName("Do"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon,
                    Token.Punctuation.CloseBrace,
                    Token.Keywords.Control.Else,
                    Token.Keywords.Control.If,
                    Token.Punctuation.OpenParen,
                    Token.Literals.Boolean.False,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Identifiers.MethodName("Dont"),
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
                    Token.Keywords.Control.While,
                    Token.Punctuation.OpenParen,
                    Token.Variables.ReadWrite("i"),
                    Token.Operators.Relational.LessThan,
                    Token.Literals.Numeric.Decimal("10"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Operators.Increment,
                    Token.Variables.ReadWrite("i"),
                    Token.Punctuation.Semicolon,
                    Token.Keywords.Control.If,
                    Token.Punctuation.OpenParen,
                    Token.Literals.Boolean.True,
                    Token.Punctuation.CloseParen,
                    Token.Keywords.Control.Continue,
                    Token.Punctuation.Semicolon,
                    Token.Keywords.Control.Break,
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
                    Token.Keywords.Lock,
                    Token.Punctuation.OpenParen,
                    Token.Keywords.New,
                    Token.PrimitiveType.Object,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.CloseParen,
                    Token.Identifiers.MethodName("Do"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("single-line lock with block", async () => {
                const input = Input.InMethod(`lock (new object()) { Do(); }`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Lock,
                    Token.Punctuation.OpenParen,
                    Token.Keywords.New,
                    Token.PrimitiveType.Object,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Identifiers.MethodName("Do"),
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
                    Token.Keywords.Lock,
                    Token.Punctuation.OpenParen,
                    Token.Keywords.New,
                    Token.PrimitiveType.Object,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.CloseParen,
                    Token.Identifiers.MethodName("Do"),
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
                    Token.Keywords.Lock,
                    Token.Punctuation.OpenParen,
                    Token.Keywords.New,
                    Token.PrimitiveType.Object,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Identifiers.MethodName("Do"),
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
                    Token.Keywords.Control.Switch,
                    Token.Punctuation.OpenParen,
                    Token.Variables.ReadWrite("i"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Keywords.Control.Case,
                    Token.Literals.Numeric.Decimal("0"),
                    Token.Punctuation.Colon,
                    Token.Keywords.Control.Goto,
                    Token.Keywords.Control.Case,
                    Token.Literals.Numeric.Decimal("1"),
                    Token.Punctuation.Semicolon,
                    Token.Keywords.Control.Case,
                    Token.Literals.Numeric.Decimal("1"),
                    Token.Punctuation.Colon,
                    Token.Keywords.Control.Goto,
                    Token.Keywords.Control.Default,
                    Token.Punctuation.Semicolon,
                    Token.Keywords.Control.Default,
                    Token.Punctuation.Colon,
                    Token.Keywords.Control.Break,
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
                    Token.Keywords.Control.Switch,
                    Token.Punctuation.OpenParen,
                    Token.Variables.ReadWrite("i"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Keywords.Control.Case,
                    Token.Literals.Numeric.Decimal("0"),
                    Token.Punctuation.Colon,
                    Token.Punctuation.OpenBrace,
                    Token.Keywords.Control.Goto,
                    Token.Keywords.Control.Case,
                    Token.Literals.Numeric.Decimal("1"),
                    Token.Punctuation.Semicolon,
                    Token.Punctuation.CloseBrace,
                    Token.Keywords.Control.Case,
                    Token.Literals.Numeric.Decimal("1"),
                    Token.Punctuation.Colon,
                    Token.Punctuation.OpenBrace,
                    Token.Keywords.Control.Goto,
                    Token.Keywords.Control.Default,
                    Token.Punctuation.Semicolon,
                    Token.Punctuation.CloseBrace,
                    Token.Keywords.Control.Default,
                    Token.Punctuation.Colon,
                    Token.Punctuation.OpenBrace,
                    Token.Keywords.Control.Break,
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
                    Token.Keywords.Control.Switch,
                    Token.Punctuation.OpenParen,
                    Token.Variables.ReadWrite("i"),
                    Token.Punctuation.CloseParen,
                    Token.Comment.MultiLine.Start,
                    Token.Comment.MultiLine.Text(" comment "),
                    Token.Comment.MultiLine.End,
                    Token.Punctuation.OpenBrace,
                    Token.Keywords.Control.Default,
                    Token.Punctuation.Colon,
                    Token.Keywords.Control.Break,
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
                    Token.Keywords.Control.Try,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Keywords.Control.Finally,
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
                    Token.Keywords.Control.Try,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Keywords.Control.Catch,
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
                    Token.Keywords.Control.Try,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Keywords.Control.Catch,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Keywords.Control.Finally,
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
                    Token.Keywords.Control.Try,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Keywords.Control.Catch,
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
                    Token.Keywords.Control.Try,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Keywords.Control.Catch,
                    Token.Punctuation.OpenParen,
                    Token.Type("Exception"),
                    Token.Identifiers.LocalName("ex"),
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
                    Token.Keywords.Control.Try,
                    Token.Punctuation.OpenBrace,
                    Token.Keywords.Control.Throw,
                    Token.Keywords.New,
                    Token.Type("Exception"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon,
                    Token.Punctuation.CloseBrace,
                    Token.Keywords.Control.Catch,
                    Token.Keywords.Control.When,
                    Token.Punctuation.OpenParen,
                    Token.Literals.Boolean.True,
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
                    Token.Keywords.Control.Try,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Keywords.Control.Catch,
                    Token.Punctuation.OpenParen,
                    Token.Type("Exception"),
                    Token.Punctuation.CloseParen,
                    Token.Keywords.Control.When,
                    Token.Punctuation.OpenParen,
                    Token.Literals.Boolean.True,
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
                    Token.Keywords.Control.Try,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Keywords.Control.Finally,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.PrimitiveType.Int,
                    Token.Identifiers.LocalName("x"),
                    Token.Punctuation.Semicolon
                ]);
            });
        });

        describe("Using", () => {
            it("single-line using with expression and embedded statement", async () => {
                const input = Input.InMethod(`using (new object()) Do();`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Using,
                    Token.Punctuation.OpenParen,
                    Token.Keywords.New,
                    Token.PrimitiveType.Object,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.CloseParen,
                    Token.Identifiers.MethodName("Do"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("single-line using with expression and block", async () => {
                const input = Input.InMethod(`using (new object()) { Do(); }`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Using,
                    Token.Punctuation.OpenParen,
                    Token.Keywords.New,
                    Token.PrimitiveType.Object,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Identifiers.MethodName("Do"),
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
                    Token.Keywords.Using,
                    Token.Punctuation.OpenParen,
                    Token.Keywords.New,
                    Token.PrimitiveType.Object,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.CloseParen,
                    Token.Identifiers.MethodName("Do"),
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
                    Token.Keywords.Using,
                    Token.Punctuation.OpenParen,
                    Token.Keywords.New,
                    Token.PrimitiveType.Object,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Identifiers.MethodName("Do"),
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
                    Token.Keywords.Using,
                    Token.Punctuation.OpenParen,
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("o"),
                    Token.Operators.Assignment,
                    Token.Keywords.New,
                    Token.PrimitiveType.Object,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.CloseParen,
                    Token.Identifiers.MethodName("Do"),
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
                    Token.Keywords.Using,
                    Token.Punctuation.OpenParen,
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("o"),
                    Token.Operators.Assignment,
                    Token.Keywords.New,
                    Token.PrimitiveType.Object,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Identifiers.MethodName("Do"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon,
                    Token.Punctuation.CloseBrace
                ]);
            });

            it("using declaration", async () => {
                const input = Input.InMethod(`using var o = new object();`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Using,
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("o"),
                    Token.Operators.Assignment,
                    Token.Keywords.New,
                    Token.PrimitiveType.Object,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ])
            });
        });

        describe("Yield", () => {
            it("yield return", async () => {
                const input = Input.InMethod(`yield return 42;`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Control.Yield,
                    Token.Keywords.Control.Return,
                    Token.Literals.Numeric.Decimal("42"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("yield break", async () => {
                const input = Input.InMethod(`yield break;`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Control.Yield,
                    Token.Keywords.Control.Break,
                    Token.Punctuation.Semicolon
                ]);
            });
        });
    });
});