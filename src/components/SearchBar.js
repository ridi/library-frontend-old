import React from 'react';

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keyword: props.keyword,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    const { onSubmit } = this.props;
    const { keyword } = this.state;

    console.log(keyword);
    onSubmit(keyword);
  }

  handleChange(e) {
    this.setState({
      keyword: e.target.value,
    });
  }

  render() {
    const { keyword } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <input placeholder="검색어를 입력해주세요." type="text" value={keyword} onChange={this.handleChange} />
        <button type="submit">검색</button>
      </form>
    );
  }
}
