describe("Simple Comparison", function() {
   
    it("ten is equal to ten", function() {
        var $GL = "return (10==10).\r\n";
        expect(execute(gl.parse($GL))).toEqual(true);
    });
    
    it("ten is not equal to eleven", function() {
        var $GL = "return (10!=11).\r\n";
        expect(execute(gl.parse($GL))).toEqual(true);
    });

    it("ten is lower to eleven", function() {
        var $GL = "return (10<11).\r\n";
        expect(execute(gl.parse($GL))).toEqual(true);
    });

    it("ten is greater to nine", function() {
        var $GL = "return (10>9).\r\n";
        expect(execute(gl.parse($GL))).toEqual(true);
    });

    it("ten is lower or equal to eleven", function() {
        var $GL = "return (10<=11).\r\n";
        expect(execute(gl.parse($GL))).toEqual(true);
    });

    it("ten is greater or equal to nine", function() {
        var $GL = "return (10>=9).\r\n";
        expect(execute(gl.parse($GL))).toEqual(true);
    });

 it("ten is lower or equal to ten", function() {
        var $GL = "return (10<=10).\r\n";
        expect(execute(gl.parse($GL))).toEqual(true);
    });

    it("ten is greater or equal to ten", function() {
        var $GL = "return (10>=10).\r\n";
        expect(execute(gl.parse($GL))).toEqual(true);
    });

});
