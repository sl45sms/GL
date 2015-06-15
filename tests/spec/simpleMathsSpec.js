describe("Simple Mathematics", function() {
   
    it("ten plus one", function() {
        var $GL = "return (10+1).\r\n";
        expect(execute(gl.parse($GL))).toEqual(11);
    });
    
    it("ten minus one", function() {
        var $GL = "return (10-1).\r\n";
        expect(execute(gl.parse($GL))).toEqual(9);
    });

    it("ten divided by two", function() {
        var $GL = "return (10/2).\r\n";
        expect(execute(gl.parse($GL))).toEqual(5);
    });

    it("ten multiplied by two", function() {
        var $GL = "return (10*2).\r\n";
        expect(execute(gl.parse($GL))).toEqual(20);
    });

    it("ten pow by two", function() {
        var $GL = "return (10^2).\r\n";
        expect(execute(gl.parse($GL))).toEqual(100);
    });

    it("ten modulus by eight", function() {
        var $GL = "return (10%8).\r\n";
        expect(execute(gl.parse($GL))).toEqual(2);
    });
    

});
