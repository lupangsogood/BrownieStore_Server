module.exports = {
    filterData(data) {
     data.forEach((value) => {
        if (value == undefined) {
            throw new Error("Some paramter is undefinded");
        }
     });
    return data;
   },
}