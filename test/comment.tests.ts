/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe("Comments", () => {
    before(() => { should(); });

    describe("Comments", () => {
        it("single-line comment", async () => {
            const input = `// foo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" foo")]);
        });

        it("single-line comment after whitespace", async () => {
            const input = `    // foo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Comment.LeadingWhitespace("    "),
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" foo")]);
        });

        it("single-line double comment (issue #100)", async () => {
            const input = `//// foo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("// foo")]);
        });

        it("multi-line comment", async () => {
            const input = `/* foo */`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Comment.MultiLine.Start,
                Token.Comment.MultiLine.Text(" foo "),
                Token.Comment.MultiLine.End]);
        });

        it("multi-line comment spanning lines", async () => {
            const input = `/* hello
world */`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Comment.MultiLine.Start,
                Token.Comment.MultiLine.Text(" hello"),
                Token.Comment.MultiLine.Text("world "),
                Token.Comment.MultiLine.End]);
        });

        it("in namespace", async () => {
            const input = Input.InNamespace(`// foo`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" foo")]);
        });

        it("in class", async () => {
            const input = Input.InClass(`// foo`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" foo")]);
        });

        it("in enum", async () => {
            const input = Input.InEnum(`// foo`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" foo")]);
        });

        it("in interface", async () => {
            const input = Input.InInterface(`// foo`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" foo")]);
        });

        it("in struct", async () => {
            const input = Input.InStruct(`// foo`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" foo")]);
        });

        it("in method", async () => {
            const input = Input.InMethod(`// foo`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" foo")]);
        });

        it("in string literal (single-line)", async () => {
            const input = Input.InMethod(`var s = "// foo";`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Var,
                Token.Identifiers.LocalName("s"),
                Token.Operators.Assignment,
                Token.Punctuation.String.Begin,
                Token.Literals.String("// foo"),
                Token.Punctuation.String.End,
                Token.Punctuation.Semicolon]);
        });

        it("in string literal (multi-line)", async () => {
            const input = Input.InMethod(`var s = "/* foo */";`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Var,
                Token.Identifiers.LocalName("s"),
                Token.Operators.Assignment,
                Token.Punctuation.String.Begin,
                Token.Literals.String("/* foo */"),
                Token.Punctuation.String.End,
                Token.Punctuation.Semicolon]);
        });

        it("comment should colorize if there isn't a space before it (issue omnisharp-vscode#225)", async () => {
            const input = Input.InClass(`
private char GetChar()//Метод возвращающий
`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Private,
                Token.PrimitiveType.Char,
                Token.Identifiers.MethodName("GetChar"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("Метод возвращающий")]);
        });

        it("comment out class declaration base type list - single line (issue #41)", async () => {
            const input = Input.FromText(`
public class CustomBootstrapper // : DefaultNancyBootstrapper
{
}
`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Class,
                Token.Identifiers.ClassName("CustomBootstrapper"),
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" : DefaultNancyBootstrapper"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("comment out class declaration base type list - multi line (issue #41)", async () => {
            const input = Input.FromText(`
public class CustomBootstrapper /* : DefaultNancyBootstrapper */
{
}
`);
            const tokens = await tokenize(input);

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

        it("comment out interface declaration base type list - single line (issue #41)", async () => {
            const input = Input.FromText(`
public interface CustomBootstrapper // : DefaultNancyBootstrapper
{
}
`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Interface,
                Token.Identifiers.InterfaceName("CustomBootstrapper"),
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" : DefaultNancyBootstrapper"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("comment out interface declaration base type list - multi line (issue #41)", async () => {
            const input = Input.FromText(`
public interface CustomBootstrapper /* : DefaultNancyBootstrapper */
{
}
`);
            const tokens = await tokenize(input);

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

        it("comment out struct declaration base type list - single line (issue #41)", async () => {
            const input = Input.FromText(`
public struct CustomBootstrapper // : DefaultNancyBootstrapper
{
}
`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Struct,
                Token.Identifiers.StructName("CustomBootstrapper"),
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" : DefaultNancyBootstrapper"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("comment out struct declaration base type list - multi line (issue #41)", async () => {
            const input = Input.FromText(`
public struct CustomBootstrapper /* : DefaultNancyBootstrapper */
{
}
`);
            const tokens = await tokenize(input);

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

        it("comment out enum declaration base type list - single line (issue #41)", async () => {
            const input = Input.FromText(`
public enum CustomBootstrapper // : byte
{
}
`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Enum,
                Token.Identifiers.EnumName("CustomBootstrapper"),
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" : byte"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("comment out enum declaration base type list - multi line (issue #41)", async () => {
            const input = Input.FromText(`
public enum CustomBootstrapper /* : byte */
{
}
`);
            const tokens = await tokenize(input);

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

        it("after property accessor (issue #50)", async () => {
            const input = Input.InClass(`
int P {
    get { return 42; } // comment1
    set { } // comment2
}`);
            const tokens = await tokenize(input);

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

        it("after event accessor (issue #50)", async () => {
            const input = Input.InClass(`
event EventHandler E {
    add { } // comment1
    remove { } // comment2
}`);
            const tokens = await tokenize(input);

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

        it("after try (issue #60)", async () => {
            const input = Input.InMethod(`
try //comment
{
}
finally
{
}
`);
            const tokens = await tokenize(input);

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

        it("after finally (issue #60)", async () => {
            const input = Input.InMethod(`
try
{
}
finally //comment
{
}
`);
            const tokens = await tokenize(input);

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

        it("after catch (issue #60)", async () => {
            const input = Input.InMethod(`
try
{
}
catch //comment
{
}
`);
            const tokens = await tokenize(input);

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

        it("after catch with exception (issue #60)", async () => {
            const input = Input.InMethod(`
try
{
}
catch (Exception) //comment
{
}
`);
            const tokens = await tokenize(input);

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

        it("after exception filter (issue #60)", async () => {
            const input = Input.InMethod(`
try
{
}
catch (DataNotFoundException dnfe) when (dnfe.GetType() == typeof(DataNotFoundException)) //Only catch exceptions that are distinctly DataNotFoundException
{
}
`);
            const tokens = await tokenize(input);

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

        it("after checked (issue #104)", async () => {
            const input = Input.InMethod(`
checked //comment
{
}
`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Checked,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("comment"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("after unchecked (issue #104)", async () => {
            const input = Input.InMethod(`
unchecked //comment
{
}
`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Unchecked,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("comment"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("after property with 'enum' keyword - single-line (issue #75)", async () => {
            const input = Input.InClass(`
public List<Guid> Associations { get; set; } //enum
public Emotion Feeling { get; set; }
`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Type("List"),
                Token.Punctuation.TypeParameters.Begin,
                Token.Type("Guid"),
                Token.Punctuation.TypeParameters.End,
                Token.Identifiers.PropertyName("Associations"),
                Token.Punctuation.OpenBrace,
                Token.Keywords.Get,
                Token.Punctuation.Semicolon,
                Token.Keywords.Set,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("enum"),
                Token.Keywords.Modifiers.Public,
                Token.Type("Emotion"),
                Token.Identifiers.PropertyName("Feeling"),
                Token.Punctuation.OpenBrace,
                Token.Keywords.Get,
                Token.Punctuation.Semicolon,
                Token.Keywords.Set,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("after property with 'event' keyword - single-line (issue #115)", async () => {
            const input = Input.InClass(`
// The word "event" in the comment below breaks highlighting in the rest
// of the file.  Adding or removing any characters in "event" such that
// it no longer matches \bevent\b will restore highlighting.
public string Bar { get; set; } // comment comment event comment
public string Baz { get; set; }
`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(` The word "event" in the comment below breaks highlighting in the rest`),
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(` of the file.  Adding or removing any characters in "event" such that`),
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(` it no longer matches \bevent\b will restore highlighting.`),
                Token.Keywords.Modifiers.Public,
                Token.PrimitiveType.String,
                Token.Identifiers.PropertyName("Bar"),
                Token.Punctuation.OpenBrace,
                Token.Keywords.Get,
                Token.Punctuation.Semicolon,
                Token.Keywords.Set,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" comment comment event comment"),
                Token.Keywords.Modifiers.Public,
                Token.PrimitiveType.String,
                Token.Identifiers.PropertyName("Baz"),
                Token.Punctuation.OpenBrace,
                Token.Keywords.Get,
                Token.Punctuation.Semicolon,
                Token.Keywords.Set,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("after property with 'event' keyword - multi-line (issue #115)", async () => {
            const input = Input.InClass(`
/* The word "event" in the comment below breaks highlighting in the rest
   of the file.  Adding or removing any characters in "event" such that
   it no longer matches \bevent\b will restore highlighting. */
public string Bar { get; set; } /* comment comment event comment */
public string Baz { get; set; }
`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Comment.MultiLine.Start,
                Token.Comment.MultiLine.Text(` The word "event" in the comment below breaks highlighting in the rest`),
                Token.Comment.MultiLine.Text(`   of the file.  Adding or removing any characters in "event" such that`),
                Token.Comment.MultiLine.Text(`   it no longer matches \bevent\b will restore highlighting. `),
                Token.Comment.MultiLine.End,
                Token.Keywords.Modifiers.Public,
                Token.PrimitiveType.String,
                Token.Identifiers.PropertyName("Bar"),
                Token.Punctuation.OpenBrace,
                Token.Keywords.Get,
                Token.Punctuation.Semicolon,
                Token.Keywords.Set,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace,
                Token.Comment.MultiLine.Start,
                Token.Comment.MultiLine.Text(" comment comment event comment "),
                Token.Comment.MultiLine.End,
                Token.Keywords.Modifiers.Public,
                Token.PrimitiveType.String,
                Token.Identifiers.PropertyName("Baz"),
                Token.Punctuation.OpenBrace,
                Token.Keywords.Get,
                Token.Punctuation.Semicolon,
                Token.Keywords.Set,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("after property with 'struct' keyword - multi-line (issue #115)", async () => {
            const input = `
public struct MyPoco
{
    public ETag Tag { get; } /* note: struct ETag was previously defined ... */
}
`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Struct,
                Token.Identifiers.StructName("MyPoco"),
                Token.Punctuation.OpenBrace,
                Token.Keywords.Modifiers.Public,
                Token.Type("ETag"),
                Token.Identifiers.PropertyName("Tag"),
                Token.Punctuation.OpenBrace,
                Token.Keywords.Get,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace,
                Token.Comment.MultiLine.Start,
                Token.Comment.MultiLine.Text(" note: struct ETag was previously defined ... "),
                Token.Comment.MultiLine.End,
                Token.Punctuation.CloseBrace]);
        });
    });
});