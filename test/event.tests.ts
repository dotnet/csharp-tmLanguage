/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token, Scope } from './utils/tokenize';

describe("Events", () => {
    before(() => { should(); });

    describe("Events", () => {
        it("declaration", async () => {
            const input = Input.InClass(`public event Type Event;`);
            const tokens = await tokenize(input, "meta.accessor.");

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Event,
                Token.Type("Type"),
                Token.Identifiers.EventName("Event"),
                Token.Punctuation.Semicolon]);
        });

        it("declaration with multiple modifiers", async () => {
            const input = Input.InClass(`protected internal event Type Event;`);
            const tokens = await tokenize(input, "meta.accessor.");

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Protected,
                Token.Keywords.Modifiers.Internal,
                Token.Keywords.Event,
                Token.Type("Type"),
                Token.Identifiers.EventName("Event"),
                Token.Punctuation.Semicolon]);
        });

        it("declaration with multiple declarators", async () => {
            const input = Input.InClass(`public event Type Event1, Event2;`);
            const tokens = await tokenize(input, "meta.accessor.");

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Event,
                Token.Type("Type"),
                Token.Identifiers.EventName("Event1"),
                Token.Punctuation.Comma,
                Token.Identifiers.EventName("Event2"),
                Token.Punctuation.Semicolon]);
        });

        it("generic", async () => {
            const input = Input.InClass(`public event EventHandler<List<T>, Dictionary<T, D>> Event;`);
            const tokens = await tokenize(input, "meta.accessor.");

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Event,
                Token.Type("EventHandler"),
                Token.Punctuation.TypeParameters.Begin,
                Token.Type("List"),
                Token.Punctuation.TypeParameters.Begin,
                Token.Type("T"),
                Token.Punctuation.TypeParameters.End,
                Token.Punctuation.Comma,
                Token.Type("Dictionary"),
                Token.Punctuation.TypeParameters.Begin,
                Token.Type("T"),
                Token.Punctuation.Comma,
                Token.Type("D"),
                Token.Punctuation.TypeParameters.End,
                Token.Punctuation.TypeParameters.End,
                Token.Identifiers.EventName("Event"),
                Token.Punctuation.Semicolon]);
        });

        it("declaration with accessors", async () => {
            const input = Input.InClass(`
public event Type Event
{
    add { }
    remove { }
}`);

            const tokens = await tokenize(input, "meta.accessor.");

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Event,
                Token.Type("Type"),
                Token.Identifiers.EventName("Event"),
                Token.Punctuation.OpenBrace,
                Token.Keywords.Add,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Keywords.Remove,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("explicitly-implemented interface member", async () => {
            const input = Input.InClass(`event EventHandler IFoo<string>.Event { add; remove; }`);
            const tokens = await tokenize(input, "meta.accessor.");

            tokens.should.deep.equal([
                Token.Keywords.Event,
                Token.Type("EventHandler"),
                Token.Type("IFoo"),
                Token.Punctuation.TypeParameters.Begin,
                Token.PrimitiveType.String,
                Token.Punctuation.TypeParameters.End,
                Token.Punctuation.Accessor,
                Token.Identifiers.EventName("Event"),
                Token.Punctuation.OpenBrace,
                Token.Keywords.Add,
                Token.Punctuation.Semicolon,
                Token.Keywords.Remove,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("declaration in interface", async () => {
            const input = Input.InInterface(`event EventHandler Event;`);
            const tokens = await tokenize(input, "meta.accessor.");

            tokens.should.deep.equal([
                Token.Keywords.Event,
                Token.Type("EventHandler"),
                Token.Identifiers.EventName("Event"),
                Token.Punctuation.Semicolon]);
        });

        it("declaration in interface with properties", async () => {
            const input = `
interface IObj
{
    int Prop1
    {
        get;
    }
    event EventHandler Event;
    int Prop2 { get; }
}`;
            const tokens = await tokenize(input, "meta.accessor.");

            tokens.should.deep.equal([
                Token.Keywords.Interface,
                Token.Identifiers.InterfaceName("IObj"),
                Token.Punctuation.OpenBrace,
                Token.PrimitiveType.Int,
                Token.Identifiers.PropertyName("Prop1"),
                Token.Punctuation.OpenBrace,
                Token.Keywords.Get,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace,
                Token.Keywords.Event,
                Token.Type("EventHandler"),
                Token.Identifiers.EventName("Event"),
                Token.Punctuation.Semicolon,
                Token.PrimitiveType.Int,
                Token.Identifiers.PropertyName("Prop2"),
                Token.Punctuation.OpenBrace,
                Token.Keywords.Get,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("declaration with attributes", async () => {
            const input = Input.InClass(`
[event: Test]
public event Action E1
{
    [Obsolete]
    add { }
    [Obsolete]
    [return: Obsolete]
    remove { }
}`);

            const tokens = await tokenize(input, "meta.accessor.");

            tokens.should.deep.equal([
                Token.Punctuation.OpenBracket,
                Token.Keywords.AttributeSpecifier("event"),
                Token.Punctuation.Colon,
                Token.Type("Test"),
                Token.Punctuation.CloseBracket,
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Event,
                Token.Type("Action"),
                Token.Identifiers.EventName("E1"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.OpenBracket,
                Token.Type("Obsolete"),
                Token.Punctuation.CloseBracket,
                Token.Keywords.Add,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Punctuation.OpenBracket,
                Token.Type("Obsolete"),
                Token.Punctuation.CloseBracket,
                Token.Punctuation.OpenBracket,
                Token.Keywords.AttributeSpecifier("return"),
                Token.Punctuation.Colon,
                Token.Type("Obsolete"),
                Token.Punctuation.CloseBracket,
                Token.Keywords.Remove,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("Expression-bodied event accessors (issue #44)", async () => {
            const input = Input.InClass(`
event EventHandler E
{
    add => Add(value);
    remove => Remove(value);
}
`);
            const tokens = await tokenize(input, "meta.accessor.");

            tokens.should.deep.equal([
                Token.Keywords.Event,
                Token.Type("EventHandler"),
                Token.Identifiers.EventName("E"),
                Token.Punctuation.OpenBrace,
                Token.Keywords.Add,
                Token.Operators.Arrow,
                ...Scope.Accessor.Setter(
                    Token.Identifiers.MethodName("Add"),
                    Token.Punctuation.OpenParen,
                    Token.Variables.Value,
                    Token.Punctuation.CloseParen,
                ),
                Token.Punctuation.Semicolon,
                Token.Keywords.Remove,
                Token.Operators.Arrow,
                ...Scope.Accessor.Setter(
                    Token.Identifiers.MethodName("Remove"),
                    Token.Punctuation.OpenParen,
                    Token.Variables.Value,
                    Token.Punctuation.CloseParen,
                ),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("comment before initializer - single line (issue #264)", async () => {
            const input = Input.InClass(`event EventHandler Event /* comment */ { add; remove; }`);
            const tokens = await tokenize(input, "meta.accessor.");

            tokens.should.deep.equal([
                Token.Keywords.Event,
                Token.Type("EventHandler"),
                Token.Identifiers.EventName("Event"),
                Token.Comment.MultiLine.Start,
                Token.Comment.MultiLine.Text(" comment "),
                Token.Comment.MultiLine.End,
                Token.Punctuation.OpenBrace,
                Token.Keywords.Add,
                Token.Punctuation.Semicolon,
                Token.Keywords.Remove,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace,
            ]);
        });

        it("comment before initializer - multiple lines (issue #264)", async () => {
            const input = Input.InClass(`
event EventHandler Event // comment
{
    add;
    remove;
}`);
            const tokens = await tokenize(input, "meta.accessor.");

            tokens.should.deep.equal([
                Token.Keywords.Event,
                Token.Type("EventHandler"),
                Token.Identifiers.EventName("Event"),
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" comment"),
                Token.Punctuation.OpenBrace,
                Token.Keywords.Add,
                Token.Punctuation.Semicolon,
                Token.Keywords.Remove,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace,
            ]);
        });

        it("declaration with default value (issue #118)", async () => {
            const input = Input.InClass(`event EventHandler Event = null;`);
            const tokens = await tokenize(input, "meta.accessor.");

            tokens.should.deep.equal([
                Token.Keywords.Event,
                Token.Type("EventHandler"),
                Token.Identifiers.EventName("Event"),
                Token.Operators.Assignment,
                Token.Literals.Null,
                Token.Punctuation.Semicolon,
            ]);
        });

        it("multiple declarations with default value (issue #118)", async () => {
            const input = Input.InClass(`
event EventHandler Event1 = delegate { },
                   Event2 = () => { }
                   , Event3 = null;`);
            const tokens = await tokenize(input, "meta.accessor.");

            tokens.should.deep.equal([
                Token.Keywords.Event,
                Token.Type("EventHandler"),
                Token.Identifiers.EventName("Event1"),
                Token.Operators.Assignment,
                Token.Keywords.Delegate,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Punctuation.Comma,
                Token.Identifiers.EventName("Event2"),
                Token.Operators.Assignment,
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Operators.Arrow,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Punctuation.Comma,
                Token.Identifiers.EventName("Event3"),
                Token.Operators.Assignment,
                Token.Literals.Null,
                Token.Punctuation.Semicolon,
            ]);
        });
    });
});
