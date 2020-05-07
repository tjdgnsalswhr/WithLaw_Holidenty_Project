const express = require('express');
const app = express();

let users =
[
  {id:1, name:'Alice'},
  {id:2, name:'Bek'},
  {id:3, name:'Chris'}
]

app.post('/users',(req, res)=>
{
  console.log('who get in here/users');
  res.json(users);
  res.end();

});
/*
app.post('/post',(req, res)=>

    {
  console.log('who get in here/post');
  var inputData;

  req.on('data', (data)=>
  {

    inputData = JSON.parse(data);
  });

  req.on('end', () =>
  {

      console.log("user_id : "+inputData.user_id + ", user_password : " +inputData.user_password);
  });

  res.write("OK!");
  res.end();

});
*/
app.listen(3000, () =>
{
  console.log('Example app listening on port 3000!');
});

