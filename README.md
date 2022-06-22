# 🖥 **Requirements**

데스크탑에서 `canvas` 테그를 지원하는 브라우저인 `Chrome`의 사용을 권장합니다. 이외에도 가능한 브라우저로는 `Firefox`, `Safari`가 있습니다.

<br />

# 💭 **Motivation**

![](/README.assets/main_screen.png)

어렸을 때 누구나 한 번쯤은 친구들과 추억의 "경찰과 도둑 게임" 해보지 않으셨나요?

저희는 세대를 불문하지 않는 추억의 경찰과 도둑 게임을 온라인에서도 플레이시켜보고 싶었습니다.

실시간으로 플레이하면서 내 팀 플레이어의 얼굴을 보며 소통까지 할 수 있는 "메타버스" 개념을 담은 게임을 만든다면 꽤 재밌게 만들 수 있겠다는 생각에서 착안하였습니다.

<br />

# 💡 **Idea Flow**

<details>

<summary>초안</summary>

처음에는 게더타운을 모방한 저희만의 `정치 Sim City`를 만들어보고자 했습니다.

도시 안에서 유세 활동을 하면서 내가 세운 공약들에 따라서 도시가 바뀌는 미니 메타버스 게임을 기획했습니다.

![](/README.assets/first_draft.png)

<center>초기 맵 디자인</center>

</details>

<details>

<summary>중간 수정</summary>

팀원들과 프로젝트 주제에 대해 논의할수록 `정치`라는 키워드를 게임에 녹여내는 것이 쉽지 않다는 것을 느꼈습니다. 그리고 우선 게임이라는 것이 `재미`가 있어야 하는데, 정치적인 요소가 들어간 게임은 다소 접근하기에 어려울 것이라 생각했습니다.

![](/README.assets/second_draft.png)

<center>초기 피그마</center>

</details>

<details>

<summary>확정된 아이디어</summary>

`메타버스` 컨셉은 유지하되 여러 유저와 함께 플레이할 수 있는 `경찰과 도둑` 게임을 만드는 것으로 주제를 바꿔보았습니다. 초안에서는 내 캐릭터가 단상에 올라가면 카메라가 켜지게끔 구상했었는데, 바꾼 계획에서는 두 캐릭터가 만나면 카메라가 켜져서 작전회의를 할 수 있게끔 바꿨습니다. 새로운 요소들을 게임에 각색하면 할수록 재밌어지는 우리의 게임을 상상할 수 있었습니다.

![](/README.assets/third_draft.png)

<center>최종 피그마</center>

</details>
<br />

# 🛠 **Tech stack**

- **Frontend**
  - React
  - react-router-dom
  - recoil
  - Phaser
  - Socket.io Client
  - simple-peer
  - Styled-components

<br />

- **Backend**
  - Node.js
  - Express
  - Socket.io

<br />

# 🎬 **Getting Started**

### **Client**

`env`파일을 `root`경로에 만들고 아래 내용을 추가해 주세요

```
REACT_APP_SERVER_URL=localhost:8000
```

```
git clone https://github.com/vaco-doreami/i-got-you-frontend.git
npm install
npm start
```

### **Server**

`env`파일을 `root`경로에 만들고 아래 내용을 추가해 주세요

```
PORT=8000
```

```
git clone https://github.com/vaco-doreami/i-got-you-backend.git
npm install
npm run dev
```

<br />

# 🌄 **Features**

|                                                                                             |                                                                                                                   |
| :-----------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------: |
| ![feature1](/README.assets/main.gif) 플레이어 생성하기를 통해<br>플레이어를 생성할 수 있다. |                   ![feature1](/README.assets/character_choice.gif) 캐릭터를 생성할 수 있다.<br>                   |
| ![feature1](/README.assets/standby.gif) 대기화면에서는 실시간으로 플레이어의 수가 변경된다. | ![feature1](/README.assets/room_list.gif) 방리스트에서는 방과 해당 방의 인원을<br>실시간으로 확인 할 수 있다.<br> |
|      ![feature1](/README.assets/police_meet.gif)경찰과 경찰이 만났을 때 작전회의 기능.      |        ![feature1](/README.assets/police_robber_meet.gif)경찰과 도둑이 만났을 때 도둑이 깜빡거리다 사라짐.        |
|    ![feature1](/README.assets/police_car_meet.gif)경찰이 차에 치였을 때 3초간 조작 금지.    |

<br />

# 🗓 **Schedules**

## **1. 프로젝트 준비 [2022.05.30 ~ 2022.06.04]**

### 프로젝트 기획 및 필요 assets 확보

- 초기 UI 구상

![](/README.assets/character_image.png)

![character](/README.assets/character_coloring.gif)

<center>Photoshop을 활용하여 캐릭터(경찰) 디자인</center>

<br />

![](/README.assets/map.png)

<center>맵 확보</center>
<br />

## **2. 코드 작성 [2022.06.05 ~ 2022.06.14]**

- webRTC 연결
- 소켓 연결
- 경찰 역할 구현
- 도둑 역할 구현
- 방장 기능
- Phaser
- 자동차 충돌
- 동시 여러 게임 진행

## **3. 배포 및 리팩토링 [2022.06.15 ~ 2022.06.24]**

- assets 크기 조정
- netlify, aws 배포
- webRTC throttle을 사용하여 반복요청 제어

</br>

# 🔎 **Why ?**

- **Phaser**

  웹게임을 개발하기 위한 게임 엔진에 뭐가 있을까 찾아보니까 Pixi와 Phaser가 가장 대표적인 게임 엔진이라는 것을 알게 되었고 두 라이브러리 모두 많은 리소스와 예제 코드를 확인할 수 있었습니다.

  두 개중에 고민하다가 프로젝트의 테마가 게임이기 때문에 보편적인 게임 개발에 필요한 요소들을 프로젝트에 적용할 수 있겠다고 생각하게 되었습니다. Pixi는 게임 이외에 웹에 필요한 다른 기능들을 구현할 경우에도 범용적으로 사용되는 반면에 Phaser는 게임 프레임워크로 게임 개발에 특화되어있어서 게임 개발에 필요한 요소들을 구현하기 편리한 기능이 Pixi보다 더 많이 있을 것 같다고 생각되어서 Phaser로 선택하게 되었습니다.

- **simple-peer**

  경찰이 도둑을 잡기만 하면 뭔가 심심할 것 같아서 어떤 기능을 게임에 적용하면 좋을지 고민하다가 경찰끼리 만났을 때, 무전을 하는 것 처럼 화상회의를 통해 도둑을 어떻게 잡을지 논의할 수 있는 기능을 게임에 추가하면 좋을 것 같다고 생각하게 되었습니다. 그래서 webRTC에 대해 찾아보게 되었고 대부분의 webRTC 관련 글에서 simple-peer 라이브러리를 사용하여 webRTC를 구현하여서 simple-peer 라이브러리를 사용하기로 하였습니다.

- **recoil**

  상태관리 라이브러리를 알아보던 중에 react 전용 라이브러리로 recoil이 러닝커브가 낮아 3주라는 짧은 시간에 적용시키는데 무리가 없을 것 같다고 생각하였습니다.

  상태로 관리해야 할 값들이 뭐가 있을지를 생각해보니까 캐릭터의 위치값이나 방향에 대한 데이터의 경우 게임 진행하는 동안에만 사용되어 따로 상태로 관리할 필요 없이 socket을 통해 데이터를 받아 바로 Phaser의 캐릭터에 적용하면 될 것 같다고 생각하게 되었고, 그러다 보니까 상태로 관리할 값이 플레이어의 정보, 모달 정도라고 생각되어서 recoil을 사용하여도 문제가 없을 것 같다고 생각되어서 recoil을 선택하게 되었습니다.

<br />

# 🖌 **Deploy**

- **Frontend**
  - Netlify : 애플리케이션 배포

<br />

- **Backend**
  - AWS Elastic Beanstalk : 애플리케이션 배포
  - Amazon ACM (AWS Certificate Manager) : SSL 발급 및 관리
  - Elastic Load Balancing : HTTPS 리스너 생성

<br />

# 📉 **Difficulties**

- 간단하게 한 판 할 수 있는 단편성 게임을 기획하다보니까 로그인해서 게임을 진행하는 방식보다는 게스트로 누구나 접속하여 간편하게 게임을 즐길 수 있게끔 구현하기로 하였습니다.

- 그래서 플레이어의 데이터를 DB에 저장하지 않고 필요한 데이터만을 일시적으로 저장하여 게임이 종료된 후에 지워주는 방식으로 진행하게 되었습니다. 플레이어의 socket 아이디를 식별할 수 있는 키값으로 설정하였는데, 그렇기 때문에 게임이 종료되기 전까지 해당 플레이어의 socket의 아이디가 유지되어야 했으며, 새로고침을 할 경우 socket이 다시 연결되어서 socket의 아이디가 변경된다는 문제가 있었습니다.

- Phaser의 특성상 1초마다 60회의 렌더링이 일어나기 때문에 특정 시점에 단 한 번의 socket 이벤트 통신을 의도했지만, 순간적으로 여러 번의 socket 이벤트가 실행되어서 코드의 흐름을 예측하기 어려웠고 그로 인해서 예상하지 못한 에러가 빈번하게 발생하였습니다.
