from django.shortcuts import render
import requests
import xmltodict
import datetime
import pandas as pd

def index(request):
    
    end = datetime.datetime.now()
    infectionStart = end - datetime.timedelta(weeks=52)
    vaccinationStart = end - datetime.timedelta(weeks=52)
    
    
    end = end.strftime("%Y%m%d")
    infectionStart = infectionStart.strftime("%Y%m%d")
    vaccinationStart = vaccinationStart.strftime("%Y%m%d")
    
    infectionData = getInfectionData(infectionStart, end)
    vaccinationData = getVaccinationData(vaccinationStart)
    sidoData = {'sido': getSidoData(end)}
    today = {
        'today': {
            'month': list(infectionData['stateDt'].values())[-1][3:5],
            'day': list(infectionData['stateDt'].values())[-1][6:8],
            'decide': insertComma(list(infectionData['decide'].values())[-1]),
            'death': insertComma(list(infectionData['death'].values())[-1]),
            'decideDelta': insertComma(list(infectionData['decide'].values())[-1]
                                      -list(infectionData['decide'].values())[-2]),
            'deathDelta': insertComma(list(infectionData['death'].values())[-1]
                                     -list(infectionData['death'].values())[-2]),
        }
    }
    
    # print(today)
    
    context = {}
    context.update(infectionData)
    context.update(vaccinationData)
    context.update(sidoData)
    context.update(today)
    
    # print(context)
    
    return render(request, 'covidView/index.html', context)

def getInfectionData(start, end):
    
    url = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19InfStateJson'
    params ={'serviceKey' : '8RgHCSdnXNPmYLpfqVEETc7qcRK7bxG6DD6yHD5jRm+HZclS/fON9Z195iwKgIbLv2YQRVS+82A/HZk+EPlDMA==',
             'pageNo' : '1',
             'numOfRows' : '1000',
             'startCreateDt' : start,
             'endCreateDt' : end }

    response = requests.get(url, params=params)
    context = response.content
    
    context = xmltodict.parse(context)
    context = dict(context)
    
    decideCnt = []
    deathCnt = []
    stateDt = []
        
    for day in context['response']['body']['items']['item']:
        decideCnt.append(int(day['decideCnt']))
        deathCnt.append(int(day['deathCnt']))
        stateDt.append(dateFormat(day['stateDt']))
    
    df = pd.DataFrame({'decideCnt': decideCnt,
                       'deathCnt': deathCnt,
                       'stateDt': stateDt})
    
    df['stateDt'] = df['stateDt'].shift(-1)
    df['decide'] = df['decideCnt'].diff().shift(-1) * -1
    df['death'] = df['deathCnt'].diff().shift(-1) * -1
        
    df.dropna(inplace=True)
    
    df['decide'] = df['decide'].map(int)
    df['death'] = df['death'].map(int)
    
    df = df.iloc[::-1]
    
    df.reset_index(inplace=True)
    
    # print(df)
    
    data = df.to_dict()
    
    return data
    
def getVaccinationData(start):
    
    url = 'https://api.odcloud.kr/api/15077756/v1/vaccine-stat'
    params = (
        ('page', '1'),
        ('perPage', '1000'),
        ('returnType', 'JSON'),
        ('cond[baseDate::GTE]', '2021-03-11 00:00:00'),
        ('cond[sido::EQ]', '\uC804\uAD6D'),
        ('serviceKey', '8RgHCSdnXNPmYLpfqVEETc7qcRK7bxG6DD6yHD5jRm+HZclS/fON9Z195iwKgIbLv2YQRVS+82A/HZk+EPlDMA=='),
    )


    response = requests.get(url, params=params).json()

    data = response['data']
    
    df = pd.DataFrame(data)
    
    df['totalFirstCntPercent'] = df['totalFirstCnt'].map(toPercent)
    df['totalSecondCntPercent'] = df['totalSecondCnt'].map(toPercent)
    df['totalThirdCntPercent'] = df['totalThirdCnt'].map(toPercent)
    
    df.drop(labels='sido', axis=1, inplace=True)
    
    df['baseDate'] = df['baseDate'].map(clip)
    df['baseDate'] = df['baseDate'].shift(1)
    
    df.dropna(inplace=True)
    
    # print(df)
    
    data = df.to_dict()
    
    return data

def getSidoData(today):
    
    url = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson'
    params ={'serviceKey' : '8RgHCSdnXNPmYLpfqVEETc7qcRK7bxG6DD6yHD5jRm+HZclS/fON9Z195iwKgIbLv2YQRVS+82A/HZk+EPlDMA==',
             'pageNo' : '1',
             'numOfRows' : '100',
             'startCreateDt' : today,
             'endCreateDt' : today }

    response = requests.get(url, params=params)
    context = response.content
    
    context = xmltodict.parse(context)
    context = dict(context)
    
    data = {}
    
    for day in context['response']['body']['items']['item']:
        incDec = int(day['incDec'])
        try:
            qurRate = int(day['qurRate'])
        except:
            qurRate = day['qurRate']
        
        data[day['gubun']] = {'incDec': incDec,
                              'qurRate': qurRate}
    
    # print(data)
    
    return data

def dateFormat(date):
    return date[2:4] + '-' + date[4:6] + '-' + date[6:8]

def insertComma(number):
    return ("{:,}".format(number))

def toPercent(number):
    return number / 51638809 * 100

def clip(date):
    return date[2:10]