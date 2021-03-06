import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class client {
	private static String startTest(List<String> sitesToTest, int iterations) {
		try {
			URL url = new URL("http://localhost:8080/startTest");
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setDoOutput(true);
			conn.setRequestMethod("POST");
			conn.setRequestProperty("Content-Type", "application/json");
			OutputStream os = conn.getOutputStream();

			JSONObject data = new JSONObject();
			data.put("sitesToTest", sitesToTest);
			data.put("iterations", iterations);

			os.write(data.toString().getBytes());
			os.flush();

			String response = runRequest(conn);

			JSONObject jsonObject = new JSONObject(response);
			return (String) jsonObject.get("testHandle");
		}
		catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
