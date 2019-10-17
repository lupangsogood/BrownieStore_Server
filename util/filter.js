module.exports = {
   async filterData(data) {
    // await this.wait();
     data.forEach((value) => {
      if (value == undefined) throw new Error("Some paramter is undefinded");
     });
    return data;
   },
  //  async wait() {
  //   await new Promise(r => setTimeout(r, 2000));
  //   console.log('wait');
  // }
}