package com.example.lawfriend_holidenty_lab_1;

import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

public class RegisterActivity extends AppCompatActivity {

    EditText register_id, register_password, register_name, register_phonenumber;
    String user_id, user_password, user_name, user_phonenumber;
    String confirm = "";
    private TextView tvData;
    private Context context;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);
        //Intent intent = new Intent(this, LoadingActivity.class);
        //startActivity(intent);
        register_id = (EditText) findViewById(R.id.register_id);
        register_password = (EditText) findViewById(R.id.register_password);
        register_name = (EditText) findViewById(R.id.register_name);
        register_phonenumber = (EditText) findViewById(R.id.register_phonenumber);

        Button btn = (Button) findViewById(R.id.registerlayout_register_button);
        btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                new JSONTask().execute("http://192.168.0.5:3000/process/register");
            }
        });

    }


    public class JSONTask extends AsyncTask<String, String, String>{

        @Override
        protected String doInBackground(String... urls) {
            try
            {
                user_id = register_id.getText().toString();
                user_password = register_password.getText().toString();
                user_name = register_name.getText().toString();
                user_phonenumber = register_phonenumber.getText().toString();
                JSONObject jsonObject = new JSONObject();
                jsonObject.accumulate("user_id", user_id);
                jsonObject.accumulate("user_password", user_password);
                jsonObject.accumulate("user_name", user_name);
                jsonObject.accumulate("user_phonenumber", user_phonenumber);

                HttpURLConnection con = null;
                BufferedReader reader = null;

                try
                {
                    //URL url = new URL("http://18.225.34.237:3000/users");
                    URL url = new URL(urls[0]);
                    con = (HttpURLConnection)url.openConnection();

                    con.setRequestMethod("POST"); //POST 방식으로 보냄
                    con.setRequestProperty("Cache-Control", "no-cache"); //캐시 설정
                    con.setRequestProperty("Content-Type","application/json"); //application JSON 형식으로 전송

                    con.setRequestProperty("Accept","text/html"); //서버에 response 데이터를 html로 받음
                    con.setDoOutput(true); //Outstream으로 post 데이터 전송
                    con.setDoInput(true); //Inputstream으로 서버로부터 응답을 받겠다는 의미

                    con.connect();

                    OutputStream outStream = con.getOutputStream(); //서버로 보내기 위해 스트림 만듬

                    BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(outStream));
                    writer.write(String.valueOf(jsonObject));
                    writer.flush();
                    writer.close(); //버퍼 닫음

                    //서버로부터 데이터 받음
                    InputStream stream = con.getInputStream();

                    reader = new BufferedReader(new InputStreamReader(stream));
                    StringBuffer buffer = new StringBuffer();
                    String line = "";
                    while((line=reader.readLine())!=null)
                    {
                        buffer.append(line);
                    }
                    reader.close();

                    return buffer.toString(); //서버로부터 받은 값을 리턴해줌 아마 OK 들어옴
                }
                catch (MalformedURLException e) {
                    //login_id.setText("1");
                    e.printStackTrace();
                }
                catch (IOException e) {
                    //login_id.setText("2");
                    e.printStackTrace();
                }
                finally {
                    if(con!=null)
                    {
                        con.disconnect();
                    }
                    try {
                        if(reader!=null)
                        {

                            reader.close();
                        }
                    }
                    catch (IOException e)
                    {

                        e.printStackTrace();
                    }

                }

            } catch (JSONException e) {

                e.printStackTrace();
            }
            return null;
        }
        @Override
        protected void onPostExecute(String result)
        {
            super.onPostExecute(result);
            //result.toString();
            //Intent intent = new Intent(LoginActivity.this, MainActivity.class);
            //startActivity(intent);
            try {
                JSONObject obj = new JSONObject(result);
                confirm = obj.getString("confirm");

            } catch (JSONException e) {
                e.printStackTrace();
            }

            if(confirm.equals("1"))
            {
                Intent intent = new Intent(context, MenuActivity.class);
                startActivity(intent);
            }
            else
                register_id.setText(confirm);

            //login_id.setText(confirm); //서버로부터 받은값 출력
        }

    }
}
