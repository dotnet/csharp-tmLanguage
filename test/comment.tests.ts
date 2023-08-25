/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token, NamespaceStyle } from './utils/tokenize';

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

        it("in block-scoped namespace", async () => {
            const input = Input.InNamespace(`// foo`, NamespaceStyle.BlockScoped);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" foo")]);
        });

        it("in file-scoped namespace", async () => {
            const input = Input.InNamespace(`// foo`, NamespaceStyle.FileScoped);
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
                Token.Keyword.Definition.Var,
                Token.Identifier.LocalName("s"),
                Token.Operator.Assignment,
                Token.Punctuation.String.Begin,
                Token.Literal.String("// foo"),
                Token.Punctuation.String.End,
                Token.Punctuation.Semicolon]);
        });

        it("in string literal (multi-line)", async () => {
            const input = Input.InMethod(`var s = "/* foo */";`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Var,
                Token.Identifier.LocalName("s"),
                Token.Operator.Assignment,
                Token.Punctuation.String.Begin,
                Token.Literal.String("/* foo */"),
                Token.Punctuation.String.End,
                Token.Punctuation.Semicolon]);
        });

        it("comment should colorize if there isn't a space before it (issue omnisharp-vscode#225)", async () => {
            const input = Input.InClass(`
private char GetChar()//Метод возвращающий
`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Private,
                Token.PrimitiveType.Char,
                Token.Identifier.MethodName("GetChar"),
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
                Token.Keyword.Modifier.Public,
                Token.Keyword.Definition.Class,
                Token.Identifier.ClassName("CustomBootstrapper"),
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
                Token.Keyword.Modifier.Public,
                Token.Keyword.Definition.Class,
                Token.Identifier.ClassName("CustomBootstrapper"),
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
                Token.Keyword.Modifier.Public,
                Token.Keyword.Definition.Interface,
                Token.Identifier.InterfaceName("CustomBootstrapper"),
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
                Token.Keyword.Modifier.Public,
                Token.Keyword.Definition.Interface,
                Token.Identifier.InterfaceName("CustomBootstrapper"),
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
                Token.Keyword.Modifier.Public,
                Token.Keyword.Definition.Struct,
                Token.Identifier.StructName("CustomBootstrapper"),
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
                Token.Keyword.Modifier.Public,
                Token.Keyword.Definition.Struct,
                Token.Identifier.StructName("CustomBootstrapper"),
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
                Token.Keyword.Modifier.Public,
                Token.Keyword.Definition.Enum,
                Token.Identifier.EnumName("CustomBootstrapper"),
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
                Token.Keyword.Modifier.Public,
                Token.Keyword.Definition.Enum,
                Token.Identifier.EnumName("CustomBootstrapper"),
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
                Token.Identifier.PropertyName("P"),
                Token.Punctuation.OpenBrace,
                Token.Keyword.Definition.Get,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Flow.Return,
                Token.Literal.Numeric.Decimal("42"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" comment1"),
                Token.Keyword.Definition.Set,
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
                Token.Keyword.Definition.Event,
                Token.Type("EventHandler"),
                Token.Identifier.EventName("E"),
                Token.Punctuation.OpenBrace,
                Token.Keyword.Definition.Add,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" comment1"),
                Token.Keyword.Definition.Remove,
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
                Token.Keyword.Exception.Try,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("comment"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Keyword.Exception.Finally,
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
                Token.Keyword.Exception.Try,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Keyword.Exception.Finally,
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
                Token.Keyword.Exception.Try,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Keyword.Exception.Catch,
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
                Token.Keyword.Exception.Try,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Keyword.Exception.Catch,
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
                Token.Keyword.Exception.Try,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Keyword.Exception.Catch,
                Token.Punctuation.OpenParen,
                Token.Type("DataNotFoundException"),
                Token.Identifier.LocalName("dnfe"),
                Token.Punctuation.CloseParen,
                Token.Keyword.Conditional.When,
                Token.Punctuation.OpenParen,
                Token.Variable.Object("dnfe"),
                Token.Punctuation.Accessor,
                Token.Identifier.MethodName("GetType"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Operator.Relational.Equals,
                Token.Operator.Expression.TypeOf,
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
                Token.Keyword.Context.Checked,
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
                Token.Keyword.Context.Unchecked,
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
                Token.Keyword.Modifier.Public,
                Token.Type("List"),
                Token.Punctuation.TypeParameter.Begin,
                Token.Type("Guid"),
                Token.Punctuation.TypeParameter.End,
                Token.Identifier.PropertyName("Associations"),
                Token.Punctuation.OpenBrace,
                Token.Keyword.Definition.Get,
                Token.Punctuation.Semicolon,
                Token.Keyword.Definition.Set,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("enum"),
                Token.Keyword.Modifier.Public,
                Token.Type("Emotion"),
                Token.Identifier.PropertyName("Feeling"),
                Token.Punctuation.OpenBrace,
                Token.Keyword.Definition.Get,
                Token.Punctuation.Semicolon,
                Token.Keyword.Definition.Set,
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
                Token.Keyword.Modifier.Public,
                Token.PrimitiveType.String,
                Token.Identifier.PropertyName("Bar"),
                Token.Punctuation.OpenBrace,
                Token.Keyword.Definition.Get,
                Token.Punctuation.Semicolon,
                Token.Keyword.Definition.Set,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" comment comment event comment"),
                Token.Keyword.Modifier.Public,
                Token.PrimitiveType.String,
                Token.Identifier.PropertyName("Baz"),
                Token.Punctuation.OpenBrace,
                Token.Keyword.Definition.Get,
                Token.Punctuation.Semicolon,
                Token.Keyword.Definition.Set,
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
                Token.Keyword.Modifier.Public,
                Token.PrimitiveType.String,
                Token.Identifier.PropertyName("Bar"),
                Token.Punctuation.OpenBrace,
                Token.Keyword.Definition.Get,
                Token.Punctuation.Semicolon,
                Token.Keyword.Definition.Set,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace,
                Token.Comment.MultiLine.Start,
                Token.Comment.MultiLine.Text(" comment comment event comment "),
                Token.Comment.MultiLine.End,
                Token.Keyword.Modifier.Public,
                Token.PrimitiveType.String,
                Token.Identifier.PropertyName("Baz"),
                Token.Punctuation.OpenBrace,
                Token.Keyword.Definition.Get,
                Token.Punctuation.Semicolon,
                Token.Keyword.Definition.Set,
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
                Token.Keyword.Modifier.Public,
                Token.Keyword.Definition.Struct,
                Token.Identifier.StructName("MyPoco"),
                Token.Punctuation.OpenBrace,
                Token.Keyword.Modifier.Public,
                Token.Type("ETag"),
                Token.Identifier.PropertyName("Tag"),
                Token.Punctuation.OpenBrace,
                Token.Keyword.Definition.Get,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace,
                Token.Comment.MultiLine.Start,
                Token.Comment.MultiLine.Text(" note: struct ETag was previously defined ... "),
                Token.Comment.MultiLine.End,
                Token.Punctuation.CloseBrace]);
        });
    });
});