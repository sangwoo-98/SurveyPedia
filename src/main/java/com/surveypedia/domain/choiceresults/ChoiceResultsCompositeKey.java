package com.surveypedia.domain.choiceresults;

import lombok.Getter;

import java.io.Serializable;
import java.util.Objects;

@Getter
public class ChoiceResultsCompositeKey implements Serializable {

    private Integer scode;
    private Integer qnumber;
    private String respondent;

    @Override
    public int hashCode() {
        return Objects.hash(scode, qnumber, respondent);
    }

    @Override
    public boolean equals(Object obj) {
        if(obj.getClass().isAssignableFrom(ChoiceResultsCompositeKey.class)) {
            ChoiceResultsCompositeKey key = (ChoiceResultsCompositeKey) obj;
            return scode == key.getScode() && qnumber == key.getQnumber() && respondent.equals(key.getRespondent());
        } else return false;
    }
}
