require 'open3'

Jekyll::Hooks.register :site, :after_init do
  cmd = 'npm run build'
  stdout, stderr, status = Open3.capture3(cmd, chdir: 'svelte_sprinkles')

  if status.success?
    puts "Successfully built Svelte sprinkles"
  else
    puts "Failed to build Svelte sprinkles"
    puts "stdout: #{stdout}"
    puts "stderr: #{stderr}"
    raise "Svelte Sprinkles build failed"
  end
end
