- [x] I want to get each element
- [x] Within a each section i'll send a request to the backend to get audio buffer response
- [x] Based on the speech need to make background smoth animation

### Text Pre-processing

- [ ] store section child nodes into a array
- [ ] make loop for child nodes
- [ ] if child nodes have child nodes then loop again
- [ ] if child nodes have text then store that text into a variable
- [ ] before send text to the server check if the text has any link or equation
- [ ] if the text has a link or equation then replace it with the text (**This is link & This is equation**)
- [ ]once we get the ready text then send it to the server

### TODO for 01-07-204

- [x] Skips reading hyperlinks issue
- [ ] We should be saving in S3 bucket in AWS and using CloudFront AWS to read them from

### TODO For Fixing production issue

- [x] Get section funcationally (**parent?.parent is not good way to get**)
- [x] Skips reading (code) text like `example` issues fix
- [x] We should prevent playing multiple things at the same time
- [x] When another cell is played the previous one should be stopped

### TODO for `1 Aug 2024`

- [x] Skip to read code cell
