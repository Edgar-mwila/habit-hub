exports.defineAutoTests=function(){describe("Console",(function(){it("console.spec.1 should exist",(function(){expect(window.console).toBeDefined()})),it("console.spec.2 has required methods log|warn|error",(function(){expect(window.console.log).toBeDefined(),expect(typeof window.console.log).toBe("function"),expect(window.console.warn).toBeDefined(),expect(typeof window.console.warn).toBe("function"),expect(window.console.error).toBeDefined(),expect(typeof window.console.error).toBe("function")}))}))},exports.defineManualTests=function(e,o){};