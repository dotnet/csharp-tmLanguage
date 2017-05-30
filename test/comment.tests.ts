/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe("Grammar", () => {
    before(() => should());

    describe("Comments", () => {
        it("single-line comment", () => {
            const input = `// foo`;
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" foo")]);
        });

        it("single-line comment after whitespace", () => {
            const input = `    // foo`;
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Comment.LeadingWhitespace("    "),
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" foo")]);
        });

        it("multi-line comment", () => {
            const input = `/* foo */`;
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Comment.MultiLine.Start,
                Token.Comment.MultiLine.Text(" foo "),
                Token.Comment.MultiLine.End]);
        });

        it("in namespace", () => {
            const input = Input.InNamespace(`// foo`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" foo")]);
        });

        it("in class", () => {
            const input = Input.InClass(`// foo`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" foo")]);
        });

        it("in enum", () => {
            const input = Input.InEnum(`// foo`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" foo")]);
        });

        it("in interface", () => {
            const input = Input.InInterface(`// foo`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" foo")]);
        });

        it("in struct", () => {
            const input = Input.InStruct(`// foo`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" foo")]);
        });

        it("in method", () => {
            const input = Input.InMethod(`// foo`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" foo")]);
        });

        it("comment should colorize if there isn't a space before it (issue omnisharp-vscode#225)", () => {
            const input = Input.InClass(`
private char GetChar()//Метод возвращающий
`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Private,
                Token.PrimitiveType.Char,
                Token.Identifiers.MethodName("GetChar"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("Метод возвращающий")]);
        });

        it("comment out class declaration base type list - single line (issue #41)", () => {
            const input = Input.FromText(`
public class CustomBootstrapper // : DefaultNancyBootstrapper
{
}
`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Class,
                Token.Identifiers.ClassName("CustomBootstrapper"),
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" : DefaultNancyBootstrapper"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("comment out class declaration base type list - multi line (issue #41)", () => {
            const input = Input.FromText(`
public class CustomBootstrapper /* : DefaultNancyBootstrapper */
{
}
`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Class,
                Token.Identifiers.ClassName("CustomBootstrapper"),
                Token.Comment.MultiLine.Start,
                Token.Comment.MultiLine.Text(" : DefaultNancyBootstrapper "),
                Token.Comment.MultiLine.End,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("comment out interface declaration base type list - single line (issue #41)", () => {
            const input = Input.FromText(`
public interface CustomBootstrapper // : DefaultNancyBootstrapper
{
}
`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Interface,
                Token.Identifiers.InterfaceName("CustomBootstrapper"),
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" : DefaultNancyBootstrapper"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("comment out interface declaration base type list - multi line (issue #41)", () => {
            const input = Input.FromText(`
public interface CustomBootstrapper /* : DefaultNancyBootstrapper */
{
}
`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Interface,
                Token.Identifiers.InterfaceName("CustomBootstrapper"),
                Token.Comment.MultiLine.Start,
                Token.Comment.MultiLine.Text(" : DefaultNancyBootstrapper "),
                Token.Comment.MultiLine.End,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("comment out struct declaration base type list - single line (issue #41)", () => {
            const input = Input.FromText(`
public struct CustomBootstrapper // : DefaultNancyBootstrapper
{
}
`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Struct,
                Token.Identifiers.StructName("CustomBootstrapper"),
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" : DefaultNancyBootstrapper"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("comment out struct declaration base type list - multi line (issue #41)", () => {
            const input = Input.FromText(`
public struct CustomBootstrapper /* : DefaultNancyBootstrapper */
{
}
`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Struct,
                Token.Identifiers.StructName("CustomBootstrapper"),
                Token.Comment.MultiLine.Start,
                Token.Comment.MultiLine.Text(" : DefaultNancyBootstrapper "),
                Token.Comment.MultiLine.End,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("comment out enum declaration base type list - single line (issue #41)", () => {
            const input = Input.FromText(`
public enum CustomBootstrapper // : byte
{
}
`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Enum,
                Token.Identifiers.EnumName("CustomBootstrapper"),
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" : byte"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("comment out enum declaration base type list - multi line (issue #41)", () => {
            const input = Input.FromText(`
public enum CustomBootstrapper /* : byte */
{
}
`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Enum,
                Token.Identifiers.EnumName("CustomBootstrapper"),
                Token.Comment.MultiLine.Start,
                Token.Comment.MultiLine.Text(" : byte "),
                Token.Comment.MultiLine.End,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("after property accessor (issue #50)", () => {
            const input = Input.InClass(`
int P {
    get { return 42; } // comment1
    set { } // comment2
}`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.Int,
                Token.Identifiers.PropertyName("P"),
                Token.Punctuation.OpenBrace,
                Token.Keywords.Get,
                Token.Punctuation.OpenBrace,
                Token.Keywords.Control.Return,
                Token.Literals.Numeric.Decimal("42"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" comment1"),
                Token.Keywords.Set,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" comment2"),
                Token.Punctuation.CloseBrace]);
        });

        it("after event accessor (issue #50)", () => {
            const input = Input.InClass(`
event EventHandler E {
    add { } // comment1
    remove { } // comment2
}`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Event,
                Token.Type("EventHandler"),
                Token.Identifiers.EventName("E"),
                Token.Punctuation.OpenBrace,
                Token.Keywords.Add,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" comment1"),
                Token.Keywords.Remove,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" comment2"),
                Token.Punctuation.CloseBrace]);
        });

        it("after try (issue #60)", () => {
            const input = Input.InMethod(`
try //comment
{
}
finally
{
}
`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Control.Try,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("comment"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Keywords.Control.Finally,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("after finally (issue #60)", () => {
            const input = Input.InMethod(`
try
{
}
finally //comment
{
}
`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Control.Try,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Keywords.Control.Finally,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("comment"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("after catch (issue #60)", () => {
            const input = Input.InMethod(`
try
{
}
catch //comment
{
}
`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Control.Try,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Keywords.Control.Catch,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("comment"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("after catch with exception (issue #60)", () => {
            const input = Input.InMethod(`
try
{
}
catch (Exception) //comment
{
}
`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Control.Try,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Keywords.Control.Catch,
                Token.Punctuation.OpenParen,
                Token.Type("Exception"),
                Token.Punctuation.CloseParen,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("comment"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("after exception filter (issue #60)", () => {
            const input = Input.InMethod(`
try
{
}
catch (DataNotFoundException dnfe) when (dnfe.GetType() == typeof(DataNotFoundException)) //Only catch exceptions that are distinctly DataNotFoundException
{
}
`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Control.Try,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Keywords.Control.Catch,
                Token.Punctuation.OpenParen,
                Token.Type("DataNotFoundException"),
                Token.Identifiers.LocalName("dnfe"),
                Token.Punctuation.CloseParen,
                Token.Keywords.Control.When,
                Token.Punctuation.OpenParen,
                Token.Variables.Object("dnfe"),
                Token.Punctuation.Accessor,
                Token.Identifiers.MethodName("GetType"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Operators.Relational.Equals,
                Token.Keywords.TypeOf,
                Token.Punctuation.OpenParen,
                Token.Type("DataNotFoundException"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseParen,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("Only catch exceptions that are distinctly DataNotFoundException"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });
    });
});