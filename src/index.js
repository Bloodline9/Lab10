import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import axios from "axios";

function RespList(props) {
  return (
    <div>
      <ul>
        {props.resps.map((resp, key) => {
          return (
            <li key={key}>
              <a className="list" href={resp.html_url}>
                {resp.name}
              </a>
              {" Владелец: "}
              <div className="owner">{resp.owner.login}</div>
              <img
                className="avatar"
                src={resp.owner.avatar_url}
                width="70"
                height="auto"
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Button(props) {
  return (
    <div className="button_wrap">
      <button onClick={props.onClick}>Получить данные</button>
    </div>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resps: [],
      param: "",
      page: 1,
      si: 1
    };

    this.loadInfo = this.loadInfo.bind(this);
  }

  async loadInfo() {
    let param = document.getElementById("value").value;
    if (!param) alert("Введите строку поиска");
    let typesort = localStorage.getItem("type");
    let page = this.state.page + 1;
    let si = this.state.page * 10 - 10;

    console.log(this.state.page, si);
    let result = await axios.get(
      "https://api.github.com/search/repositories?sience=" +
        si +
        "&" +
        "q=" +
        param +
        "&sort=" +
        typesort +
        "&page=" +
        page +
        "&per_page=10"
    );
    result = result.data.items;
    this.setState(() => {
      return { resps: result };
    });
  }

  prev() {
    if (this.state.page === 0) {
      alert("Вы на первой странице");
    } else this.loadInfo();
    this.setState(() => {
      return { page: this.state.page - 1 };
    });
  }
  next() {
    this.loadInfo();
    this.setState(() => {
      return { page: this.state.page + 1 };
    });
  }

  render() {
    return (
      <div>
        <h4>Введите строку поиска</h4>
        <input id="value" />
        <h4>Выберите тип сортировки</h4>
        <button
          type="Submit"
          onClick={() => {
            localStorage.clear();
            localStorage.setItem("type", "stars");
          }}
        >
          stars
        </button>
        <button
          type="Submit"
          onClick={() => {
            localStorage.clear();
            localStorage.setItem("type", "forks");
            this.state.page = this.state.page;
          }}
        >
          forks
        </button>

        <Button label={this.state.label} onClick={this.loadInfo} />

        <RespList resps={this.state.resps} />
        <button onClick={() => this.prev()}>Предыдущая страница</button>
        <button onClick={() => this.next()}>Следующая страница</button>
        <h4>Текущая страница {this.state.page}</h4>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
