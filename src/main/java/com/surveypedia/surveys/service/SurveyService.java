package com.surveypedia.surveys.service;

import com.surveypedia.domain.members.Members;
import com.surveypedia.domain.pointhistory.PointHistoryRepository;
import com.surveypedia.domain.surveys.SurveysRepository;
import com.surveypedia.surveys.dto.SurveyInfoDto;
import com.surveypedia.surveys.exception.SurveyInsertCheckException;
import com.surveypedia.tools.ObjectMaker;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class SurveyService {

    private final SurveysRepository surveysRepository;
    private final PointHistoryRepository pointHistoryRepository;

    public org.json.simple.JSONObject getSurveyInfo(HttpServletRequest request, String type) {
        org.json.simple.JSONObject jsonObject = ObjectMaker.getSimpleJSONObject();
        List<SurveyInfoDto> list = null;
        try {
            switch (type) {
                case "deadLine":
                    list = surveysRepository.getSurveyInfoByDeadLine().stream().map(SurveyInfoDto::new).collect(Collectors.toList());
                    break;
                case "spareSampleNum":
                    list = surveysRepository.getSurveyInfoBySpareSampleNum().stream().map(SurveyInfoDto::new).collect(Collectors.toList());
                    break;
                case "endSurvey":
                    list = surveysRepository.getSurveyInfoByEnd().stream().map(SurveyInfoDto::new).collect(Collectors.toList());
                    break;
                default:
                    break;
            }
            org.json.simple.JSONArray jsonArray = ObjectMaker.getSimpleJSONArray();
            for(SurveyInfoDto dto : list) {
                org.json.simple.JSONObject jTemp = ObjectMaker.getSimpleJSONObject();
                jTemp.putAll(dto.convertMap());
                jsonArray.add(jTemp);
            }
            jsonObject.put("list", jsonArray);
            jsonObject.put("errno", 0);
        } catch(Exception exception) {
            exception.printStackTrace();
            jsonObject = ObjectMaker.getJSONObjectWithException(exception);
            jsonObject.put("errno", 1);
        }
        Members member = (Members)request.getSession(false).getAttribute("userInfo");
        if(member == null) jsonObject.put("respondent", null);
        else jsonObject.put("respondent", member.getEmail());
        return jsonObject;
    }

    public org.json.simple.JSONObject isRegisterable(HttpServletRequest request) {
        org.json.simple.JSONObject jsonObject = ObjectMaker.getSimpleJSONObject();
        String email = ((Members)request.getSession(false).getAttribute("userInfo")).getEmail();
        int writeCount = surveysRepository.getWriteCount(email);
        int participateCount = pointHistoryRepository.getParticipateCount(email);
        try {
            boolean result = (((participateCount / 2) - writeCount) > -1);
            if(!result) throw new SurveyInsertCheckException();
            jsonObject.put("result", true);
        } catch(SurveyInsertCheckException exception) {
            jsonObject = ObjectMaker.getJSONObjectWithException(exception);
        }
        return jsonObject;
    }
}
