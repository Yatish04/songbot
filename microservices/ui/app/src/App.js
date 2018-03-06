import React from 'react';
import './App.css';
import ChatBotMessage from './components/chatbotmessage';
import UserMessage from './components/usermessage';
import Grid from 'material-ui/Grid';
import Input from './components/footerinput';
import { withStyles } from 'material-ui/styles'
import Loading from './components/loading';
import { Scrollbars } from 'react-custom-scrollbars';


const styles=theme=>({
  grid1: {
    flexBasis: "90%",
    overflow: 'auto',
    //backgroundColor: 'white'
    //padding: '20px 20px 0px 0px',
    // border:"1px solid white",
  },
  grid2: {
    flexBasis: "10%",
    // border:"1px solid white",
    position: 'absolute',
    bottom: 2,
    right: 0,
    left: 0
  },
  container: {
    // minHeight: '660px',
    width: '100%',
    // minHeight: '805px',
    height: '100vh'
   //height: '660px',
   //width: '1290px',
   //border: '4px solid grey',
  },
});

class Chat extends React.Component {
constructor(props){
    super(props)
    this.state = {
      chatHistory: [{type: 'bot' , loading: true}],
      loading: true
    }
    this.handleSubmit=this.handleSubmit.bind(this);
    this.renderThumb = this.renderThumb.bind(this);
  }
//fetching bot's greeting message
componentDidMount() {
 fetch('https://app.boorish86.hasura-app.io/input', {
    method: 'POST',
    body: JSON.stringify({
      input: 'hi'
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
  .then(response => response.json())
  .then( data => {
    let ms = data.response;
    let obj= [{ type: 'bot', message: ms, mtype: 'text', data: {},loading: false}]
    this.setState({chatHistory: obj});
  })
  .catch((error) => {
    console.log('Fetch Error :-S', error);
    let obj= [{ type: 'bot', message: 'Network Error! Try again!', mtype: 'text', data: {},loading: false}]
    this.setState({chatHistory: obj});
  });
}
//rendering and sending user input
handleSubmit(e) {
  var currentHistory;
  //for updating ui
  let promise = new Promise((resolve, reject) => {
  currentHistory = this.state.chatHistory;
  var obj= { type: 'user', message: e}
  currentHistory = currentHistory.concat(obj);
  currentHistory = currentHistory.concat({type:'bot',loading: true});
  this.setState({chatHistory: currentHistory });
    resolve();
  })

  promise.then(()=> this.refs.scrollbars.scrollToBottom())
   //for sending reply
   fetch('https://app.boorish86.hasura-app.io/input', {
    method: 'POST',
    body: JSON.stringify({
      input: e
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    //storing data
    let audio,charts,watch,ms,download,obj,type='',supportingData;
      audio = {
        audiosrc:data.audiosrc,
        albumart:data.albumart,
        name: data.name
      };
      charts = data.charts;
      watch = data.embed;
      download = data.download;
      //checking which type of data received
    if(audio['audiosrc'] !== '') {
      type = 'audio';
      supportingData =audio;
    }
    else if(charts["list"] !== '') {
      type= "charts";
      supportingData =charts;
    }
    else if(watch !== ""){
      type= "video";
      supportingData = watch;
    }
    else if(download !== ""){
      type= "download";
      supportingData = download;
    }
    else {
      supportingData ="";
    }
    ms = data.response;
    currentHistory.pop();
    obj= { type: 'bot', message: ms, mtype: type, data: supportingData , loading: false}
    currentHistory =currentHistory.concat(obj);
    this.setState({chatHistory: currentHistory});
    this.refs.scrollbars.scrollToBottom();
  })
  .catch((error) => {
    console.log('Fetch Error :-S', error);
    currentHistory.pop();
    let obj= [{ type: 'bot', message: 'Network Error! Try again!', mtype: 'text', data: {},loading: false}]
    currentHistory =currentHistory.concat(obj);
    this.setState({chatHistory: currentHistory});
    this.refs.scrollbars.scrollToBottom();
  });
}

renderThumb({ style, ...props }) {
  //const { top } = this.state;
  const thumbStyle = {
      backgroundColor: 'grey'
  };
  return (
      <div
          style={{ ...style, ...thumbStyle }}
          {...props}/>
  );
}

 render() {
  const {classes}= this.props;
  return (
   <Grid container className={classes.container} direction='column' justify='space-between'>
     <Grid item xs={12} style={{padding: '20px 0px 0px 20px'}} className={classes.grid1}>
     <Scrollbars
      ref="scrollbars"
      renderThumbHorizontal={this.renderThumb}
      renderThumbVertical={this.renderThumb}
     >
     {this.state.chatHistory.map((chats,index) =>
        (chats.type==='user'?
        <UserMessage key={index}  message={chats.message}/> :
        (chats.loading ? <Loading key={index}/> : <ChatBotMessage mtype={chats.mtype} data={chats.data} message={chats.message}  key={index}/>)))}
     </Scrollbars>
     </Grid>
     <Grid item xs={12}  className={classes.grid2}>
      <Input onSubmit={this.handleSubmit}/>
    </Grid>
  </Grid>);
  }
}

export default withStyles(styles)(Chat);


